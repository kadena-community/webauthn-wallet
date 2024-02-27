'use client';

import { AccountButton } from '@/components/AccountButton';
import { DeliveredOrder } from '@/components/Delivery/DeliveredOrder/DeliveredOrder';
import { DeliveryTransit } from '@/components/Delivery/DeliveryTransit/DeliveryTransit';
import { PickUpApproval } from '@/components/Delivery/PickUpApproval/PickUpApproval';
import { ReadyForPickUp } from '@/components/Delivery/ReadyForPickUp/ReadyForPickUp';
import { PizzaWorld } from '@/components/icons/PizzaWorld';
import { OrderProvider } from '@/context/OrderContext';
import { useReturnUrl } from '@/hooks/useReturnUrl';
import { getAccountFrom } from '@/utils/account';
import { Box, Heading, Stack, Text } from '@kadena/react-ui';
import { ChainId } from '@kadena/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useConnection } from '../Connection';
import * as styles from '../order.css';
import { useDelivery } from '../useDelivery';
import { useLoggedInAccount } from '../useLoggedInAccount';
import './page.css';

type CourierProps = {
  searchParams: {
    user: string;
    transaction: string;
  };
};

export default function CourierPage({ searchParams }: CourierProps) {
  const { user, transaction } = searchParams;
  const { account } = useLoggedInAccount(user);
  const { orders, saveDelivery, pickupDelivery, deliverOrder, updateOrders } =
    useDelivery({
      chainId: process.env.CHAIN_ID as ChainId,
      networkId: process.env.DAPP_NETWORK_ID!,
    });
  const { isLoading, messages, setId, send } = useConnection();
  const router = useRouter();
  const { getReturnUrl } = useReturnUrl();

  const merchantAccount = process.env.MERCHANT_ACCOUNT;

  if (!merchantAccount) {
    throw new Error('Merchant account is not configured.');
  }

  useEffect(() => {
    if (!messages.length) return;
    messages
      .filter((m) => m.type === 'orders' && m.data?.orders?.length)
      .flatMap((m) =>
        m.data.orders.map((order: any) => saveDelivery(order.orderId)),
      );
    updateOrders();
  }, [messages]);

  useEffect(() => {
    if (isLoading) return;
    if (!account?.accountName) return;
    setId({ id: '1234', publicKey: account?.accountName });
  }, [account?.accountName, isLoading]);

  useEffect(() => {
    if (!account?.accountName) return;
    if (isLoading) return;
    send(
      {
        id: '1234',
        publicKey: merchantAccount,
      },
      {
        type: 'id',
        data: {
          id: '1234',
          publicKey: account?.accountName,
        },
      },
    );
  }, [account?.accountName, isLoading]);

  useEffect(() => {
    if (!account?.accountName) return;
    if (isLoading) return;
    if (!transaction) return;
    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
    const cmd = JSON.parse(tx.cmd);
    if (cmd.meta.sender !== account.accountName) {
      send(
        {
          id: '1234',
          publicKey: cmd.meta.sender,
        },
        {
          type: 'tx',
          data: tx,
        },
      );
    } else {
      send(
        {
          id: '1234',
          publicKey: merchantAccount,
        },
        {
          type: 'tx',
          data: tx,
        },
      );
    }
  }, [isLoading, transaction, account?.accountName]);

  const pickUpTransaction = JSON.parse(
    Buffer.from(transaction || '', 'base64').toString() || '""',
  );
  const deliveredOrders = orders?.filter((o) => o.status === 'DELIVERED') || [];
  const readyOrders =
    orders?.filter((o) => o.status === 'READY_FOR_DELIVERY') || [];
  const pendingOrder = readyOrders.find(
    (o) => pickUpTransaction && pickUpTransaction.cmd.includes(o.orderId),
  );
  const transitOrder = orders?.find((o) => o.status === 'IN_TRANSIT');
  const readyOrdersToPickUp = readyOrders.filter(
    (newOrder) => pendingOrder?.orderId !== newOrder.orderId,
  );

  return (
    <OrderProvider>
      <Stack className={styles.hero} flexDirection="column">
        <Box textAlign="right">
          <PizzaWorld className={styles.logo} />
          <Text
            variant="small"
            style={{
              fontWeight: 'bold',
              marginBlockStart: '-0.25rem',
              display: 'block',
            }}
          >
            Delivery dashboard
          </Text>
        </Box>
      </Stack>

      <Stack justifyContent="flex-end" marginBlockEnd="md">
        <Stack justifyContent="flex-end" gap="md" className={styles.account}>
          <AccountButton
            className={styles.button}
            user={account}
            returnPath="/v1/example/delivery/courier"
          />
        </Stack>
      </Stack>

      {account && (
        <>
          {!!deliveredOrders?.length && (
            <Stack
              flexDirection="column"
              paddingInline="lg"
              marginBlockEnd="xl"
              gap="md"
            >
              <Stack marginBlock="xl" justifyContent="center">
                <Heading variant="h5" as="h3">
                  Delivered orders
                </Heading>
              </Stack>
              {deliveredOrders.map((deliveredOrder) => (
                <DeliveredOrder
                  key={`${deliveredOrder.orderId}-delivered`}
                  order={deliveredOrder}
                />
              ))}
            </Stack>
          )}
          {!deliveredOrders?.length && (
            <Stack marginBlock="xl" justifyContent="center">
              <Heading variant="h5" as="h3">
                No delivered orders
              </Heading>
            </Stack>
          )}

          {transitOrder && (
            <Stack
              flexDirection="column"
              paddingInline="lg"
              marginBlockEnd="xl"
              gap="md"
            >
              <Stack marginBlock="xl" justifyContent="center">
                <Heading variant="h5" as="h3">
                  Current delivery
                </Heading>
              </Stack>
              <DeliveryTransit order={transitOrder} />
            </Stack>
          )}

          {pendingOrder && (
            <Stack
              flexDirection="column"
              paddingInline="lg"
              marginBlockEnd="xl"
              gap="md"
            >
              <Stack marginBlock="xl" justifyContent="center">
                <Heading variant="h5" as="h3">
                  Current delivery
                </Heading>
              </Stack>
              <PickUpApproval order={pendingOrder} />
            </Stack>
          )}

          {!!readyOrdersToPickUp?.length && (
            <Stack
              flexDirection="column"
              paddingInline="lg"
              marginBlockEnd="xl"
              gap="md"
            >
              <Stack marginBlock="xl" justifyContent="center">
                <Heading variant="h5" as="h3">
                  Ready for pick-up
                </Heading>
              </Stack>
              {readyOrdersToPickUp.map((readyOrder) => (
                <ReadyForPickUp
                  key={`${readyOrder.orderId}-ready`}
                  order={readyOrder}
                />
              ))}
            </Stack>
          )}
          {!readyOrdersToPickUp?.length && (
            <Stack marginBlock="xl" justifyContent="center">
              <Heading variant="h5" as="h3">
                No orders to pick up
              </Heading>
            </Stack>
          )}
        </>
      )}
    </OrderProvider>
  );
}
