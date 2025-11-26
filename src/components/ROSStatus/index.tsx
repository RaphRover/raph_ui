import { useRosContext } from '@/scripts/context/RosContext';
import Frame from '@/components/ui/Frame';
import WifiOn from './wifi_on.svg?react';
import WifiOff from './wifi_off.svg?react';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function ROSStatus() {
  const { ros } = useRosContext();

  const icon = () => {
    return ros ? (
      <WifiOn className={clsx(styles.icon, styles.green)} />
    ) : (
      <WifiOff className={clsx(styles.icon, styles.red)} />
    );
  };

  return (
    <Frame className={styles.frame}>
      ROS Status
      {icon()}
    </Frame>
  );
}
