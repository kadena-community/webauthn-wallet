import { Button } from '@/components/Button/Button';
import { Box, Heading, Stack, Text } from '@kadena/react-ui';
import Image from 'next/image';
import { Product } from '../mock/products';
import * as styles from './Product.css';

interface Props {
  product: Product;
}

export function Product({ product }: Props) {
  const orderItems: string[] = [];
  const onDecrementOrderItem = (productName: string) => () =>
    console.log('Add', productName);

  const onIncrementOrderItem = (productName: string) => () =>
    console.log('Add', productName);

  const orderItemAmount = orderItems.filter(
    (orderItem) => orderItem === product.name,
  ).length;

  return (
    <Stack flexDirection="column">
      <Image
        className={styles.productImage}
        src={product.image}
        alt={product.name}
      />
      <Stack justifyContent="space-between">
        <Box marginBlockStart="xs">
          <Heading variant="h5" as="h3">
            {product.name}
          </Heading>
          <div>$ {product.price.toFixed(2)}</div>
        </Box>
        <Stack
          gap="sm"
          alignItems="flex-start"
          justifyContent="center"
          marginBlockStart="sm"
        >
          <Button
            onPress={onDecrementOrderItem(product.name)}
            style={{
              paddingBlock: '0.25rem',
              paddingInline: '0.5rem',
            }}
          >
            -
          </Button>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: '1.25rem',
              marginBlockStart: '0.125rem',
            }}
          >
            {orderItemAmount}
          </Text>
          <Button
            onPress={onIncrementOrderItem(product.name)}
            style={{
              paddingBlock: '0.25rem',
              paddingInline: '0.5rem',
            }}
          >
            +
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
