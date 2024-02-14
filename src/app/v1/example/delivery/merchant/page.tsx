'use client';

import { AccountButton } from '@/components/AccountButton';
import { useReturnUrl } from '@/hooks/useReturnUrl';
import { SubmitStatus, useSubmit } from '@/hooks/useSubmit';
import { Box, Table } from '@kadena/react-ui';
import Link from 'next/link';
import { useEffect } from 'react';
import type { Message } from '../Connection';
import { useConnection } from '../Connection';
import { useLoggedInAccount } from '../useLoggedInAccount';

type MerchantProps = {
  searchParams: {
    user: string;
    transaction: string;
  };
};

export default function MerchantPage({ searchParams }: MerchantProps) {
  const { user } = searchParams;
  const { account } = useLoggedInAccount(user);
  const { connect, setId, send, isLoading, messages } = useConnection();
  const { getReturnUrl } = useReturnUrl();

  const { status, doSubmit, tx } = useSubmit(searchParams);

  useEffect(() => {
    if (!account?.accountName) return;
    setId({ id: '1234', publicKey: account?.accountName });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (status !== SubmitStatus.SUBMITABLE) return;
    const originMsg = messages.find((m) => m.data.hash === tx.hash);
    doSubmit();
    if (!originMsg) return;
    send(originMsg.connectionId, { type: 'confirm', data: tx });
  }, [status, isLoading, messages]);
  return (
    <div>
      <Box margin="md">
        <h1>Merchant Page</h1>
        <AccountButton
          user={account}
          returnPath="/v1/example/delivery/merchant"
        />
      </Box>
      <Table.Root>
        <Table.Body>
          {Array.from(
            messages
              .reduce((s, m) => {
                s.set(m.data.hash, m);
                return s;
              }, new Map<string, Message>())
              .values(),
          ).map((message, index) => (
            <Table.Tr key={message.data.hash}>
              <Table.Td>{message.type}</Table.Td>
              <Table.Td>{message.data.hash}</Table.Td>
              <Table.Td>
                <Link
                  href={`${process.env.WALLET_URL}/sign?transaction=${Buffer.from(
                    JSON.stringify(message.data),
                  ).toString('base64')}&returnUrl=${getReturnUrl(
                    '/v1/example/delivery/merchant',
                  )}`}
                >
                  sign
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}