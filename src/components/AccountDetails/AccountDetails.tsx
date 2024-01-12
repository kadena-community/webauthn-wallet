import { Account } from '@/context/AccountsContext';
import { getChainwebDataUrl } from '@/context/NetworkContext';
import { Box, Text } from '@kadena/react-ui';
import useSWR from 'swr';
import { details } from './AccountDetails.css';

interface AccountDetailsProps {
  account: Account;
}

export function AccountDetails({ account }: AccountDetailsProps) {
  const domain = getChainwebDataUrl(account.network || '');
  const { data, error, isLoading } = useSWR(
    `${domain}/txs/account/${account.accountName}`,
    async (url: string) => {
      if (!account) return [];
      return await fetch(url).then((res) => res.json());
    },
  );

  return (
    <div className={details}>
      {data?.map((tx: any, index: number) => (
        <Box key={tx.requestKey + index}>
          <Text>
            {tx.fromAccount}, {tx.toAccount}
            <span
              style={{
                color: tx.fromAccount === account.accountName ? 'red' : 'green',
              }}
            >
              {tx.amount}
            </span>
          </Text>
        </Box>
      ))}
    </div>
  );
}
