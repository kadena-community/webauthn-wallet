import { Account } from '@/context/AccountsContext';
import { Box, Stack } from '@kadena/react-ui';
import Image from 'next/image';
import CardLogo from '../../assets/images/card-logo.svg';
import {
  accountAliasContainer,
  card,
  cardContentBottom,
  cardContentContainer,
  cardLogo,
  txAndBalance,
} from './Card.css';
import { ReactNode } from 'react';

type CardProps = {
  account?: Account;
  onClick?: (account: Account) => void;
  balancePercentage?: number;
  title?: ReactNode;
  icons?: ReactNode;
  center?: ReactNode;
  cardBottom?: ReactNode;
};

export default function Card({
  account = undefined,
  onClick = (account: Account) => {},
  balancePercentage = 10,
  title = undefined,
  icons = undefined,
  center = undefined,
  cardBottom = undefined,
}: CardProps) {
  return (
    <Box
      className={card}
      style={{
        '--card-progress': `${balancePercentage}%`,
      }}
      onClick={() => onClick(account)}
    >
      <Stack
        flexDirection="column"
        justifyContent="space-between"
        className={cardContentContainer}
      >
        <Stack flexDirection="row">
          <Stack
            flexDirection="row"
            alignItems="center"
            className={accountAliasContainer}
          >
            {title}
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            {icons}
          </Stack>
        </Stack>
        {center}
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          className={cardContentBottom}
        >
          <Stack flexDirection="column" className={txAndBalance}>
            {cardBottom}
          </Stack>
          <Image src={CardLogo} alt="Card logo" className={cardLogo} />
        </Stack>
      </Stack>
    </Box>
  );
}
