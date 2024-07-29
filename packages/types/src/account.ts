import type { ChainId, ITransactionDescriptor } from '@kadena/client';

export type QueuedTx = ITransactionDescriptor;

export type OptimalTransactionsAccount = Pick<
  Account,
  'chainIds' | 'accountName' | 'networkId' | 'requestedFungibles'
>;
export type RequestedFungible = {
  fungible: string;
  amount: number;
};
export type Account = {
  alias: string;
  accountName: string;
  minApprovals: number;
  minRegistrationApprovals: number;
  balance: string;
  devices: Device[];
  // The keyset refguard of the r:account, in the future,
  // this will be a keyset, but this will only happen after coin v7
  guard: string;
  networkId: string;
  chainIds: ChainId[];
  txQueue: QueuedTx[];
  requestedFungibles?: RequestedFungible[];
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
  pendingRegistrationTxs?: ITransactionDescriptor[];
  name?: string;
};
