import type { Device } from '@kadena/spirekey-types';
import classNames from 'classnames';

import { getDeviceIcon } from '@/utils/getDeviceIcon';

import * as styles from './DeviceCircle.css';

interface Props {
  device: Device;
}
export default function DeviceCircle({ device }: Props) {
  return (
    <div
      className={classNames(
        styles.device,
        styles.backgroundColors[device.color],
      )}
    >
      {getDeviceIcon(device.deviceType)}
    </div>
  );
}
