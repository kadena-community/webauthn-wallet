'use client';

import type { Account, Device } from '@kadena/spirekey-types';
import { startAuthentication } from '@simplewebauthn/browser';

import { useAccounts } from '@/context/AccountsContext';
import { getSignature } from '@/utils/getSignature';

import { getAccountsForTx } from '@/utils/consent';
import { publishEvent } from '@/utils/publishEvent';
import { Button, Stack } from '@kadena/kode-ui';
import { ICommandPayload, IUnsignedCommand } from '@kadena/types';
import { LayoutSurface } from '../LayoutSurface/LayoutSurface';

import { Permissions } from '@/components/Permissions/Permissions';
import { l1Client } from '@/utils/shared/client';
import useSWR from 'swr';

interface Props {
  transaction?: string;
}

// @TODO get from other package?
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

export default function Sign(props: Props) {
  const { transaction } = props;
  const { accounts } = useAccounts();
  if (!transaction) return;

  const data = transaction
    ? Buffer.from(transaction, 'base64').toString()
    : null;
  const tx: IUnsignedCommand = JSON.parse(data ?? '{}');

  const { data: x } = useSWR(tx.hash, async () => {
    const res = await l1Client.local(tx, {
      signatureVerification: false,
      preflight: true,
    });

    return res.events
      ?.filter(
        (e) =>
          e.module.name === 'coin' &&
          !e.module.namespace &&
          e.name === 'TRANSFER',
      )
      .reduce((total, m) => {
        const cost = m.params[2];
        if (typeof cost !== 'number') return total;
        return total + cost;
      }, 0);
  });

  console.warn('DEBUGPRINT[15]: Sign.tsx:67: x=', x);

  const txAccounts = getAccountsForTx(accounts)(tx);

  const onSignPlumbing = async () => {
    // TODO: create crosschain tx
    // find a suitable source chain, or multiple if not enough on one chain
    // determine correct target chain, i.e. chain of tx requested for signing
    // now all info is present and prep the first step of the defpact
    // add the plumbing tx's to the accounts
  }

  const onSign = async () => {
    // TODO: get credential id by pubkey
    const credentialId = accounts[0]?.devices[0]['credential-id'];

    const res = await startAuthentication({
      challenge: tx.hash,
      rpId: window.location.hostname,
      allowCredentials: credentialId
        ? [{ id: credentialId, type: 'public-key' }]
        : undefined,
    });

    publishEvent('signed', {
      // TODO: add accounts with the additional txs
      [tx.hash]: [
        {
          ...getSignature(res.response),
          pubKey: getPubkey(accounts, credentialId),
        },
      ],
    });
  };

  const onCancel = () => publishEvent('canceled:sign');

  const { signers }: ICommandPayload = JSON.parse(tx.cmd);
  const keys = txAccounts.accounts.flatMap((a) =>
    a.devices.flatMap((d) => d.guard.keys),
  );
  const caps = signers
    .filter((s) => keys.includes(s.pubKey))
    .flatMap((s) => s.clist)
    .reduce((caps, cap) => {
      const module = cap?.name.replace(/\.(?:.(?!\.))+$/, '') || '';
      const moduleCaps = caps.get(module) || [];
      caps.set(module, [...moduleCaps, cap]);
      return caps;
    }, new Map());

  const getSubtitle = (size: number) => {
    if (size > 1) return `asked for the following ${caps.size} modules`;
    return 'asked for the following module';
  };

  return (
    <LayoutSurface title="Permissions" subtitle={getSubtitle(caps.size)}>
      {[...caps.entries()].map(([module, capabilities]) => (
        <Permissions module={module} capabilities={capabilities} key={module} />
      ))}
      <Stack gap="md" justifyContent="space-between">
        <Button variant="outlined" onPress={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onPress={onSign}>
          Sign
        </Button>
      </Stack>
    </LayoutSurface>
  );
}
