'use client';

import { Account } from '@/components/Account';
import { Button } from '@/components/Button/Button';
import { useReturnUrl } from '@/hooks/useReturnUrl';
import { useSubmit } from '@/hooks/useSubmit';
import { decodeAccount } from '@/utils/decodeAccount';
import { transfer } from '@/utils/transfer';
import { Box, Stack, Text, TextField } from '@kadena/react-ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useConnection } from './Connection';
import pizza from './pizza.png';

type DeliveryProps = {
  searchParams: {
    response: string;
    payload: string;
  };
};

const price = 2.55;
export default function DeliveryPage({ searchParams }: DeliveryProps) {
  const { response } = searchParams;
  const { tx } = useSubmit(searchParams);
  const account = decodeAccount(response);
  const { connect, setId, send, isLoading } = useConnection();
  const { getReturnUrl } = useReturnUrl();

  const router = useRouter();
  const { register, getValues, watch } = useForm({
    defaultValues: {
      receiver: 'c:-BtZKCieonbuxQHJocDqdUXMZgHwN4XDNQjXXSaTJDo',
      amount: 1,
    },
    reValidateMode: 'onChange',
  });

  const onReceiverChange = () => {
    connect({
      id: '1234',
      publicKey: getValues('receiver'),
    });
  };
  const onSend = async () => {
    if (!account) return;
    const tx = await transfer({
      amount: getValues('amount') * price,
      receiver: getValues('receiver'),
      sender: account.accountName,
      gasPayer: getValues('receiver'),
      namespace: process.env.NAMESPACE!,
      networkId: 'fast-development',
      publicKey: account?.publicKey,
    });
    router.push(
      `${process.env.WALLET_URL}/sign?payload=${Buffer.from(
        JSON.stringify(tx),
      ).toString('base64')}&cid=${account.cid}&returnUrl=${getReturnUrl(
        '/v1/example/delivery',
      )}`,
    );
  };

  useEffect(() => {
    if (!account?.accountName) return;
    setId({ id: '1234', publicKey: account?.accountName });
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!tx) return;
    send(
      { id: '1234', publicKey: getValues('receiver') },
      { type: 'tx', data: tx },
    );
  }, [tx, isLoading]);
  return (
    <div>
      <Box margin="md">
        <h1>Delivery Page</h1>
        <Account account={account} returnPath="/v1/example/delivery" />
      </Box>
      {tx && <Box margin="md">Order pending...</Box>}
      {!tx && (
        <Stack gas="md" margin="md" flexDirection="column">
          <Box margin="md">
            <Image src={pizza} alt="pizza" width={100} height={100} />
          </Box>
          <TextField
            defaultValue="1"
            {...register('amount', {
              valueAsNumber: true,
              min: 1,
            })}
            label="Amount of slices"
            type="number"
          />
          <Text>Price: {watch('amount') * price}</Text>
          <Button onPress={onSend}>order</Button>
        </Stack>
      )}
    </div>
  );
}
