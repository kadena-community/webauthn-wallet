'use client';

import { useReturnUrl } from '@/hooks/shared/useReturnUrl';
import { fundAccount } from '@/utils/fund';
import {
  getAccountName,
  getWebAuthnPubkeyFormat,
  registerAccountOnChain,
} from '@/utils/register';
import { retryPromises } from '@/utils/retryPromises';
import { getAccountFrom } from '@/utils/shared/account';
import { l1Client } from '@/utils/shared/client';
import { getDevnetNetworkId } from '@/utils/shared/getDevnetNetworkId';
import {
  BuiltInPredicate,
  ChainId,
  ITransactionDescriptor,
} from '@kadena/client';
import { createContext, useContext, useEffect, useState } from 'react';

export type Account = {
  alias: string;
  accountName: string;
  balance: string;
  devices: Device[];
  networkId: string;
};

export type Device = {
  domain: string;
  color: string;
  deviceType: string;
  ['credential-id']: string;
  guard: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  pendingRegistrationTx?: string;
  name?: string;
};

export type AccountRegistration = {
  accountName: string;
  alias: string;
  color: string;
  deviceType: string;
  domain: string;
  credentialId: string;
  credentialPubkey: string;
  networkId: string;
};

export type AccountRecovery = Omit<AccountRegistration, 'accountName'>;

const migrateAccountNetworkToNetworkId = (
  account: Account & { network?: string },
): Account => {
  const migratedAccount = {
    ...account,
    networkId: account.network || account.networkId,
  };
  delete migratedAccount.network;
  return migratedAccount;
};

const getAccountsFromLocalStorage = (): Account[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawLocalAccounts = localStorage.getItem('localAccounts') || '[]';

  try {
    const parsedAccounts = JSON.parse(rawLocalAccounts) as
      | Account[]
      | Record<string, Account>;
    const accounts = Array.isArray(parsedAccounts)
      ? parsedAccounts
      : Object.values(parsedAccounts);
    const migratedAccounts = accounts.map(migrateAccountNetworkToNetworkId);
    localStorage.setItem('localAccounts', JSON.stringify(migratedAccounts));

    return migratedAccounts;
  } catch {
    return [];
  }
};

const defaultState = {
  networks: ['mainnet01', 'testnet04', getDevnetNetworkId()],
  accounts: getAccountsFromLocalStorage(),
  registerAccount: async (
    data: AccountRegistration,
  ): Promise<ITransactionDescriptor | undefined> => undefined,
  setAccount: (account: Account): void => undefined,
};

const networks = ['mainnet01', 'testnet04', getDevnetNetworkId()];

export const AccountsContext = createContext(defaultState);

type Props = {
  children: React.ReactNode;
};

const AccountsProvider = ({ children }: Props) => {
  const { host } = useReturnUrl();

  const [accounts, setAccounts] = useState<Account[]>(
    getAccountsFromLocalStorage(),
  );

  useEffect(() => {
    const enrichAccountsWithChainData = async () => {
      const updatedAccounts = await fetchAccountsFromChain(accounts);
      setAccounts(updatedAccounts);
    };

    enrichAccountsWithChainData();
  }, []);

  // - sync the accounts to local storage every time the accounts data change
  // - check pending device registration transactions
  useEffect(() => {
    localStorage.setItem('localAccounts', JSON.stringify(accounts));

    const checkPendingTxs = async () => {
      for (const account of accounts) {
        for (const device of account.devices) {
          if (device.pendingRegistrationTx) {
            listenForRegistrationTransaction({
              requestKey: device.pendingRegistrationTx,
              chainId: process.env.CHAIN_ID as ChainId,
              networkId: account.networkId,
            });
          }
        }
      }
    };

    checkPendingTxs();
  }, [accounts]);

  const fetchAccountsFromChain = async (localAccounts: Account[]) => {
    return Promise.all(
      localAccounts.map(async (localAccount) => {
        const { accountName, networkId, alias, devices } = localAccount;
        try {
          const remoteAccount = await getAccountFrom({
            networkId,
            accountName,
          });

          if (remoteAccount === null) {
            throw new Error('Account not found on chain');
          }

          const uniqueDevices = Array.from(
            [...remoteAccount.devices, ...devices]
              .reduce(
                (allUniqueDevices, d) =>
                  allUniqueDevices.set(d['credential-id'], d),
                new Map(),
              )
              .values(),
          );

          return {
            accountName,
            networkId,
            alias,
            balance: remoteAccount.balance || '0',
            devices: uniqueDevices.map((device: Device) => {
              const deviceOnChain = remoteAccount.devices.find(
                (d) => d['credential-id'] === device['credential-id'],
              );

              return { ...deviceOnChain, ...device };
            }),
          };
        } catch (e: unknown) {
          try {
            await retryPromises<ITransactionDescriptor>(() =>
              recoverAccount({
                alias,
                networkId,
                credentialPubkey: devices[0].guard.keys[0],
                credentialId: devices[0]['credential-id'],
                color: devices[0].color,
                deviceType: devices[0].deviceType,
                domain: host,
              }),
            );
          } catch (e: unknown) {
            console.error(
              `Couldn't restore account ${accountName} on ${networkId}`,
            );
          }

          // We've stored our local data on chain, so localAccount === remoteAccount
          return localAccount;
        }
      }),
    );
  };

  const setAccount = (account: Account): void => {
    const updatedAccounts =
      accounts?.filter((a) => a.accountName !== account.accountName) || [];
    updatedAccounts.unshift(account);
    setAccounts(updatedAccounts);
  };

  const addAccount = (account: Account): void => {
    setAccounts([account, ...accounts]);
  };

  const registerAccount = async ({
    accountName,
    alias,
    color,
    deviceType,
    domain,
    credentialId,
    credentialPubkey,
    networkId,
  }: AccountRegistration): Promise<ITransactionDescriptor> => {
    const { requestKey, chainId } = await registerAccountOnChain({
      accountName,
      color,
      deviceType,
      domain,
      credentialId,
      credentialPubkey,
      networkId,
    });

    const devices: Device[] = [
      {
        domain,
        color,
        deviceType,
        'credential-id': credentialId,
        guard: {
          keys: [getWebAuthnPubkeyFormat(credentialPubkey)],
          pred: 'keys-any',
        },
        pendingRegistrationTx: requestKey,
      },
    ];
    const account = {
      accountName,
      alias,
      networkId,
      devices,
      balance: '0',
    };
    addAccount(account);

    if (
      process.env.INSTA_FUND === 'true' &&
      networkId === getDevnetNetworkId()
    ) {
      await l1Client.listen({ requestKey, chainId, networkId });
      await fundAccount(account);
    }

    return {
      requestKey,
      chainId,
      networkId,
    };
  };

  const recoverAccount = async ({
    alias,
    color,
    deviceType,
    domain,
    credentialId,
    credentialPubkey,
    networkId,
  }: AccountRecovery): Promise<ITransactionDescriptor> => {
    // TODO: remove this when we support mainnet
    if (networkId === 'mainnet01')
      throw new Error('We do not support mainnet yet');

    const accountName = await getAccountName(credentialPubkey, networkId);

    if (!accountName) throw new Error('Wallet smart contract not found.');

    const { requestKey, chainId } = await registerAccount({
      accountName,
      alias,
      color,
      deviceType,
      domain,
      credentialId,
      credentialPubkey,
      networkId,
    });

    return {
      requestKey,
      chainId,
      networkId,
    };
  };

  const removePendingTransaction = (requestKey: string) => {
    const account = accounts.find((a) =>
      a.devices.map((d) => d.pendingRegistrationTx).includes(requestKey),
    );

    if (!account) {
      return;
    }

    for (let device of account.devices) {
      if (device.pendingRegistrationTx === requestKey) {
        delete device.pendingRegistrationTx;
        break;
      }
    }

    setAccount(account);
  };

  const listenForRegistrationTransaction = async (
    tx: ITransactionDescriptor,
  ) => {
    const result = await l1Client.listen(tx);
    if (result.result.status === 'success') {
      removePendingTransaction(tx.requestKey);
    }
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        networks,
        registerAccount,
        setAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within a AccountsProvider');
  }
  return context;
};

export { AccountsProvider, useAccounts };
