import { MaskedValue } from '@/components/MaskedValue/MaskedValue';
import { Account } from '@/context/AccountsContext';
import { getNetworkDisplayName } from '@/utils/getNetworkDisplayName';
import { Stack, SystemIcon, Text } from '@kadena/react-ui';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { AccountRevealer } from '../AccountRevealer/AccountRevealer';
import {
  account as accountStyle,
  copyButton,
  namespaceStyle,
} from './AccountNetwork.css';
import { cardContentCenter, network } from './Card.css';

type AccountNetworkProps = {
  account: Account;
  isLoading?: boolean;
};

export default function AccountNetwork({
  account,
  isLoading,
}: AccountNetworkProps) {
  const [, copy] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [hasCopied]);

  const [accountNamespace, accountName] = account.accountName.split(':');

  return (
    <Stack flexDirection="column" className={cardContentCenter}>
      <Stack flexDirection="row" alignItems="center" className={accountStyle}>
        <span data-testid="accountName" className={namespaceStyle}>
          {accountNamespace}:
        </span>
        {isLoading ? (
          <AccountRevealer accountName={accountName} reveal={!isLoading} />
        ) : (
          <MaskedValue value={accountName} />
        )}
        <button
          className={copyButton}
          onClick={(e) => {
            e.stopPropagation();
            copy(account.accountName);
            setHasCopied(true);
          }}
        >
          {hasCopied ? (
            <SystemIcon.Check size="md" color="green" />
          ) : (
            <SystemIcon.ContentCopy size="md" color="black" />
          )}
        </button>
      </Stack>
      <Text className={network}>{getNetworkDisplayName(account.network)}</Text>
    </Stack>
  );
}
