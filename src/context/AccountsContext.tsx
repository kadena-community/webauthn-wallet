'use client';

import { getAccountFrom } from '@/utils/account';
import { l1Client } from '@/utils/client';
import { fundAccount } from '@/utils/fund';
import { getDevnetNetworkId } from '@/utils/getDevnetNetworkId';
import {
  getWebAuthnPubkeyFormat,
  registerAccountOnChain,
} from '@/utils/register';
import { ChainId, ITransactionDescriptor } from '@kadena/client';
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
    pred: 'keys-any';
  };
  pendingRegistrationTx?: string;
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

const getAccountsFromLocalStorage = (): Account[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawLocalAccounts =
    localStorage !== undefined
      ? localStorage.getItem('localAccounts')
      : undefined;

  if (!rawLocalAccounts) {
    return [];
  }

  try {
    const localAccounts = JSON.parse(rawLocalAccounts) as
      | Account[]
      | Record<string, Account>;

    if (Array.isArray(localAccounts)) {
      return localAccounts;
    }

    const mutatedAccounts = Object.values(localAccounts);
    localStorage.setItem('localAccounts', JSON.stringify(mutatedAccounts));

    return mutatedAccounts;
  } catch (e: unknown) {
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

const fetchAccountsFromChain = async (localAccounts: Account[]) => {
  return await Promise.all(
    localAccounts.map(async (localAccount) => {
      const { accountName, networkId, alias, devices } = localAccount;
      let remoteAccount: Account;
      try {
        remoteAccount = await getAccountFrom({
          networkId,
          accountName,
        });
      } catch (e: unknown) {
        return localAccount;
      }

      if (!remoteAccount) {
        return localAccount;
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
    }),
  );
};

const AccountsProvider = ({ children }: Props) => {
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

    addAccount({
      accountName,
      alias,
      networkId,
      devices,
      balance: '0',
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

    if (
      process.env.INSTA_FUND === 'true' &&
      account.networkId === getDevnetNetworkId()
    ) {
      // fire and forget
      fundAccount(account);
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
