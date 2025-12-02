import { useRosContext } from '@/scripts/context/RosContext';
import Frame from '@/components/ui/Frame';
import WifiOn from './wifi_on.svg?react';
import WifiOff from './wifi_off.svg?react';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function ROSStatus({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { ros } = useRosContext();

  const icon = () => {
    return ros ? (
      <WifiOn className={clsx(styles.icon, styles.green)} />
    ) : (
      <WifiOff className={clsx(styles.icon, styles.red)} />
    );
  };

  return (
    <Frame className={clsx(styles.frame, className)} {...props}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {icon()}
        <span>ROS Status</span>
      </div>
    </Frame>
  );
}
