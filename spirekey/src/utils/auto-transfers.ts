import { getAccountFromChain } from '@/utils/shared/account';
import { createTransactionBuilder, type ChainId } from '@kadena/client';
import { Account, OptimalTransactionsAccount } from '@kadena/spirekey-types';
import BigNumber from 'bignumber.js';

export type Credential = {
  pubKey: string;
  credentialId: string;
};
export type AccountBalance = {
  accountName: string;
  credentials: Credential[];
  balance: number;
  chainId: ChainId;
  networkId: string;
  cost: number;
};
export const getAccountBalances = (
  account: Pick<Account, 'chainIds' | 'accountName' | 'networkId'>,
) =>
  Promise.all(
    account.chainIds.map(async (chainId) => {
      const details = await getAccountFromChain({
        accountName: account.accountName,
        networkId: account.networkId,
        chainId,
      });
      if (!details) return null;
      return {
        accountName: account.accountName,
        networkId: account.networkId,
        chainId,
        credentials: details.devices.flatMap((d) =>
          d.guard.keys.map((pubKey) => ({
            pubKey,
            credentialId: d['credential-id'],
          })),
        ),
        balance: parseFloat(details.balance),
        cost: 0,
      };
    }),
  );

const getMinCost = (requested: number, available: number) => {
  if (available > requested) return requested;
  return available;
};
type OptimalTransfers = {
  required: number;
  balances: AccountBalance[];
};
const gasFeeMargins = 1e-4;
export const getOptimalTransfers = (
  accountBalances: AccountBalance[],
  target: ChainId,
  amount: number,
) => {
  const { balances, required } = accountBalances
    .sort(sortAccountBalances(target))
    .reduce(
      (r: OptimalTransfers, { balance, chainId, ...accountBalance }) => {
        if (r.required <= 0) return r;
        if (chainId === target)
          return {
            required: BigNumber(r.required).minus(balance).toNumber(),
            balances: [...r.balances],
          };

        const amount = getMinCost(
          r.required,
          BigNumber(balance).minus(gasFeeMargins).toNumber(),
        );
        return {
          required: BigNumber(r.required).minus(amount).toNumber(),
          balances: [
            ...r.balances,
            { ...accountBalance, balance, chainId, cost: amount },
          ],
        };
      },
      { required: amount, balances: [] },
    );
  if (required > 0) return null;
  return balances.filter(({ chainId }) => chainId !== target);
};

export const sortAccountBalances =
  (target: ChainId) =>
  (
    a: Pick<AccountBalance, 'balance' | 'chainId'>,
    b: Pick<AccountBalance, 'balance' | 'chainId'>,
  ) => {
    if (a.chainId === target) return -1;
    if (b.chainId === target) return 1;
    return b.balance - a.balance;
  };

const moduleName = `${process.env.NAMESPACE}.webauthn-wallet`;
type TransferCommand = ReturnType<typeof getTransferCommand>;
export const getTransferCommand = (
  accountBalance: AccountBalance,
  target: ChainId,
) =>
  createTransactionBuilder({
    meta: {
      sender: accountBalance.accountName,
      chainId: accountBalance.chainId,
      gasLimit: 1500,
      gasPrice: 1e-8,
    },
  }).execution(
    `(${moduleName}.transfer-crosschain
      "${accountBalance.accountName}"
      "${accountBalance.accountName}"
      (${moduleName}.get-wallet-guard
        "${accountBalance.accountName}"
      )
      "${target}"
      ${accountBalance.cost.toFixed(8)}
    )`,
  );
export const getTransferCaps =
  (accountBalance: AccountBalance, target: ChainId) => (cmd: TransferCommand) =>
    accountBalance.credentials
      .reduce(
        (cmd, credential) =>
          cmd.addSigner(
            { pubKey: credential.pubKey, scheme: 'WebAuthn' },
            (withCap) => [
              withCap(
                `${moduleName}.TRANSFER_XCHAIN`,
                accountBalance.accountName,
                accountBalance.accountName,
                { decimal: accountBalance.cost.toFixed(8) },
                target,
              ),
              withCap(`${moduleName}.GAS`, accountBalance.accountName),
              withCap(
                `${moduleName}.GAS_PAYER`,
                accountBalance.accountName,
                { int: 1 },
                1,
              ),
            ],
          ),
        cmd,
      )
      .setNetworkId(accountBalance.networkId)
      .createTransaction();

export const getTransferTransaction =
  (target: ChainId) => (accountBalance: AccountBalance) => {
    const cmd = getTransferCommand(accountBalance, target);
    return getTransferCaps(accountBalance, target)(cmd);
  };

export const getOptimalTransactions = async (
  account: OptimalTransactionsAccount,
  target: ChainId,
  amount: number,
) => {
  const accountBalances = await getAccountBalances(account);
  const optimalTransfers = getOptimalTransfers(
    accountBalances.filter((x) => !!x),
    target,
    amount,
  );
  if (!optimalTransfers) return null;
  return optimalTransfers.map(getTransferTransaction(target));
};
