import { Box } from '@kadena/kode-ui';
import type { Account, Device } from '@kadena/spirekey-types';

import { getDeviceIcon } from '@/utils/getDeviceIcon';

import * as styles from './Card.css';

type DeviceIconsProps = {
  account: Account;
  device?: Device;
  showSingleIcon?: boolean;
};

export default function DeviceIcons({
  account,
  device,
  showSingleIcon = false,
}: DeviceIconsProps) {
  const firstDevice = account.devices[0];
  const uniqueDeviceTypes = new Set<string>([
    device?.deviceType || firstDevice.deviceType,
  ]);

  // Display all unique device types on the first card
  if (
    !showSingleIcon &&
    (!device || firstDevice['credential-id'] === device['credential-id'])
  ) {
    account.devices.map((d) => uniqueDeviceTypes.add(d.deviceType));
  }

  return Array.from(uniqueDeviceTypes).map((type, i) => {
    const icon = getDeviceIcon(type);
    return (
      <Box key={i} className={styles.device}>
        {icon}
      </Box>
    );
  });
}
