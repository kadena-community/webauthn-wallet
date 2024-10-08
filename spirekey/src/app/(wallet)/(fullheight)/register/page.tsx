import type { ChainId } from '@kadena/client';
import dynamic from 'next/dynamic';

const Registration = dynamic(
  () => import('@/components/Registration/Registration'),
  {
    ssr: false,
  },
);

interface Props {
  searchParams: {
    redirectUrl?: string;
    networkId?: string;
    chainId?: ChainId;
  };
}

export default function Register({ searchParams }: Props) {
  const redirectUrl = searchParams.redirectUrl;
  const networkId = searchParams.networkId;
  const chainId = searchParams.chainId;

  return (
    <Registration
      redirectUrl={redirectUrl}
      networkId={networkId || process.env.WALLET_NETWORK_ID}
      chainId={chainId || process.env.CHAIN_ID}
    />
  );
}
