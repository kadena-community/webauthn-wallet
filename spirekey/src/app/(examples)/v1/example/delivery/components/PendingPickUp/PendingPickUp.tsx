import { MonoLoading } from '@kadena/kode-icons/system';
import { Heading, Stack, maskValue } from '@kadena/kode-ui';

import { Order } from '@/app/(examples)/v1/example/delivery/useDelivery';
import { Surface } from '@/components/Surface/Surface';

interface Props {
  order: Order;
}

export function ReadyForPickUp({ order }: Props) {
  return (
    <>
      <Surface>
        <Stack flexDirection="column" marginBlockEnd="md">
          <Stack
            justifyContent="space-between"
            alignItems="flex-start"
            marginBlockEnd="md"
          >
            <Heading variant="h5">
              Delivery price: $ {order.deliveryPrice.toFixed(2)}
            </Heading>
            <MonoLoading />
          </Stack>
        </Stack>
        <Heading variant="h6">Merchant: {maskValue(order.merchant)}</Heading>
        <Heading variant="h6">Customer: {maskValue(order.buyer)}</Heading>
        <Heading variant="h6">
          Order value: $ {order.orderPrice.toFixed(2)}
        </Heading>
      </Surface>
    </>
  );
}
