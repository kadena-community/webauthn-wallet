import { asyncPipe } from '@/utils/asyncPipe';
import { l1Client } from '@/utils/client';
import { genesisPrivateKey, genesisPubKey } from '@/utils/constants';
import { signWithKeyPair } from '@/utils/signSubmitListen';
import { ChainId, createTransaction } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

export const fundAccount = async ({
  account,
  network,
}: {
  account: string;
  network: string;
}): Promise<string> =>
  asyncPipe(
    getCommand({ account, network }),
    createTransaction,
    signWithKeyPair({
      publicKey: genesisPubKey,
      secretKey: genesisPrivateKey,
    }),
    l1Client.submit,
    l1Client.listen,
    (tx) => JSON.stringify(tx),
  )({});

const getCommand = ({
  account,
  network,
}: {
  account: string;
  network: string;
}) => {
  if (network === 'fast-development') return fundLocally(account);
  if (network === 'testnet04') return fundViaFaucet(account);
  throw new Error(`Unsupported network: ${network}`);
};

const fundLocally = (account: string) =>
  composePactCommand(
    execution(
      `
      (coin.transfer
        "sender00"
        "${account}"
        100.0
      )
    `.trim(),
    ),
    setMeta({
      chainId: process.env.CHAIN_ID as ChainId,
      gasLimit: 10000,
      gasPrice: 0.0000001,
      ttl: 60000,
      senderAccount: 'sender00',
    }),
    addSigner(genesisPubKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', 'sender00', account, 100),
    ]),
    setNetworkId('fast-development'),
  );

const fundViaFaucet = (account: string) =>
  composePactCommand(
    execution(
      `
      (n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.request-coin "${account}" 100.0)
    `.trim(),
    ),
    setMeta({
      chainId: process.env.CHAIN_ID as ChainId,
      gasLimit: 10000,
      gasPrice: 0.0000001,
      ttl: 60000,
      senderAccount: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA', // faucet gas account
    }),
    addSigner(genesisPubKey, (withCap) => [
      withCap(
        'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.GAS_PAYER',
        account,
        { int: 1 },
        1,
      ),
      withCap(
        'coin.TRANSFER',
        'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
        account,
        100,
      ),
    ]),
    setNetworkId('testnet04'),
  );
