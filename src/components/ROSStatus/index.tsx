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
      <WifiOn
        className={clsx(styles.icon, styles.green)}
        aria-label="ros-connected"
      />
    ) : (
      <WifiOff
        className={clsx(styles.icon, styles.red)}
        aria-label="ros-disconnected"
      />
    );
  };

  return (
    <Frame className={clsx(styles.frame, className)} {...props}>
      <div className={styles.wrapper}>
        {icon()}
        <span>ROS Status</span>
      </div>
    </Frame>
  );
}
