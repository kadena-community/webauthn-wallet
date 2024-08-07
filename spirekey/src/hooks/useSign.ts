import type { Account, Device } from '@kadena/spirekey-types';
import { ICommand, addSignatures } from '@kadena/client';
import { startAuthentication } from '@simplewebauthn/browser';

import { useAccounts } from '@/context/AccountsContext';
import { getSignature } from '@/utils/getSignature';

const getPubkey = (
  accounts: Account[],
  credentialId: Device['credential-id'],
) => {
  for (const account of accounts) {
    for (const device of account.devices) {
      if (credentialId === device['credential-id']) {
        return device.guard.keys[0];
      }
    }
  }
  throw new Error('No public key found');
};

export const useSign = () => {
  const { accounts } = useAccounts();

  const sign = async (tx: ICommand, credentialId: string) => {
    const res = await startAuthentication({
      challenge: tx.hash,
      rpId: window.location.hostname,
      allowCredentials: credentialId
        ? [{ id: credentialId, type: 'public-key' }]
        : undefined,
    });

    const signedTx = addSignatures(tx, {
      ...getSignature(res.response),
      pubKey: getPubkey(accounts, credentialId),
    });

    // const unsignedSigIndex = signedTx.sigs.findIndex((x: null) => x === null);
    // if (unsignedSigIndex !== -1) {
    //   const payload: IPactCommand = JSON.parse(signedTx.cmd);
    //   const nextSigner: any = payload.signers[unsignedSigIndex];
    //   const signer = signersData.find((x) =>
    //     x.devices.find((y) =>
    //       y.guard.keys.find((z) => z === nextSigner.pubKey),
    //     ),
    //   );

    //   if (!signer) throw new Error('No signer found');

    //   const params = getSignParams(signedTx, signer.devices[0]);
    //   const signPath = `/sign?payload=${params.payload}&cid=${params.cid}&signers=${signers}&originReturnUrl=${originReturnUrl}`;
    //   setSignPath(signPath);
    //   setSignUrl(`${walletUrl}${signPath}`);
    // }

    return signedTx;
  };

  return {
    sign,
  };
};
