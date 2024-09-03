import { type ApolloClient, gql, useLazyQuery, useQuery } from '@apollo/client';
import { Account } from '@kadena/spirekey-types';

const getAccountQuery = gql`
  query GetAccount($code: String!) {
    ${Array(20)
      .fill(1)
      .map(
        (_, i) => `
    chain${i}: pactQuery(pactQuery: { chainId: "${i}", code: $code }) {
      result
    }
   `,
      )}
  }
`;

type AccountsVariable = {
  networkId?: string;
};
type ApolloContext = {
  client: ApolloClient<any>;
};
export const accounts = async (
  _: any,
  { networkId }: AccountsVariable,
  { client }: ApolloContext,
) => {
  const networkIds = networkId
    ? [networkId]
    : ['development', 'testnet04', 'mainnet01'];
  const accs = networkIds.flatMap((networkId) => localAccounts(networkId));
  const resolvedAccs = await Promise.all(
    accs.map(async (acc) => {
      const res = await client.query({
        query: getAccountQuery,
        variables: {
          code: `(kadena.spirekey.details "${acc.accountName}" coin)`,
          networkId: acc.networkId,
        },
      });
      return Object.values(res.data)
        .flatMap((r) => r)
        .map((r: any) => ({
          ...JSON.parse(r.result),
          txQueue: acc.txQueue,
          networkId: acc.networkId,
        }));
    }),
  );
  return resolvedAccs.map((r) =>
    r.reduce(
      (acc, info) => {
        const account: Account = {
          ...acc,
          accountName: info.account,
          guard: info.guard,
          minApprovals: 1,
          minRegistrationApprovals: 1,
          devices: info.devices,
          balance: acc.balance + info.balance,
          txQueue: [],
          networkId: info.networkId,
        };
        return account;
      },
      {
        __typename: 'Account',
        balance: 0,
        chainIds: Array(20)
          .fill(1)
          .map((_, i) => i.toString()),
      },
    ),
  );
};
const localAccounts = (networkId: string) => {
  const accString = localStorage.getItem('localAccounts');
  if (!accString) return [];
  const accs: Account[] = JSON.parse(accString);
  return accs.filter((a: Account) => a.networkId === networkId);
};
const getAccountsQuery = gql`
  query GetAccounts($networkId: String) {
    accounts(networkId: $networkId) @client
  }
`;
export const account = async (
  _: any,
  {
    networkId,
    accountName,
    fungible = 'coin',
  }: { networkId: string; accountName: string; fungible?: string },
  { client }: ApolloContext,
) => {
  const res = await client.query({
    query: getAccountQuery,
    variables: {
      code: `(kadena.spirekey.details "${accountName}" ${fungible})`,
      networkId,
    },
  });
  return Object.values(res.data)
    .flatMap((r) => r)
    .map((r: any) => ({
      ...JSON.parse(r.result),
      txQueue: [],
      networkId,
    }))
    .reduce(
      (acc, info) => {
        const account: Account = {
          ...acc,
          accountName: info.account,
          guard: info.guard,
          minApprovals: 1,
          minRegistrationApprovals: 1,
          devices: info.devices.map((d: any) => ({
            ...d,
            deviceType: d['device-type'],
          })),
          balance: acc.balance + info.balance,
          txQueue: [],
          networkId: info.networkId,
        };
        return account;
      },
      {
        __typename: 'Account',
        balance: 0,
        chainIds: Array(20)
          .fill(1)
          .map((_, i) => i.toString()),
      },
    );
};
const isDifferentAccountWith = (account: Account) => (acc: Account) =>
  acc.networkId !== account.networkId &&
  acc.accountName !== account.accountName;
const setAccount = (account: Account) => {
  const accounts: Account[] = JSON.parse(
    localStorage.getItem('localAccounts') || '[]',
  );
  const isDifferentAccount = isDifferentAccountWith(account);
  if (accounts.every(isDifferentAccount))
    return localStorage.setItem(
      'localAccounts',
      JSON.stringify([...accounts, account]),
    );
  return localStorage.setItem(
    'localAccounts',
    JSON.stringify(
      accounts.map((acc) => {
        if (isDifferentAccount(acc)) return acc;
        return {
          ...acc,
          ...account,
        };
      }),
    ),
  );
};
const accountQuery = gql`
  query AccountQuery($accountName: String!, $networkId: String!) {
    account(accountName: $accountName, networkId: $networkId) @client
  }
`;
export const useAccount = () => {
  const [execute] = useLazyQuery(accountQuery);
  const getAccount = async (networkId: string, accountName: string) => {
    const { data } = await execute({ variables: { networkId, accountName } });
    return data.account;
  };
  return { getAccount, setAccount };
};
export const useAccounts = () => {
  const [execute] = useLazyQuery(getAccountsQuery);
  const getAccounts = async (networkId?: string) => {
    const { data } = await execute({ variables: { networkId } });
    return data.accounts;
  };
  return { getAccounts };
};
