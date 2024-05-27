import fingerprint from '@/assets/images/fingerprint.svg';
import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import { Stack, Text } from '@kadena/react-ui';
import Image from 'next/image';

interface Props {
  isInProgress: boolean;
  onClick: () => void;
}

export default function Passkey({ isInProgress, onClick }: Props) {
  return (
    <SurfaceCard
      title="Passkey"
      description={
        isInProgress
          ? 'Your account is being created'
          : 'Create your account with a Passkey'
      }
      onClick={onClick}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="xs"
      >
        <Image
          src={fingerprint}
          alt="fingerprint icon"
          width={64}
          height={64}
        />
        <Text variant="ui">Tap to continue</Text>
      </Stack>
    </SurfaceCard>
  );
}