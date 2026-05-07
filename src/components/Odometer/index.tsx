import Frame from '@/components/ui/Frame';
import useRosTopicSubscription from '@/scripts/hooks/useRosTopicSubscription';
import type { OdometryMsg } from '@/types/rosInterfaces';
import styles from './styles.module.css';

export default function Odometer() {
  const odom = useRosTopicSubscription<OdometryMsg>(
    'controller/odom',
    'nav_msgs/msg/Odometry',
    100,
  );

  const distance = odom
    ? Math.sqrt(odom.pose.pose.position.x ** 2 + odom.pose.pose.position.y ** 2)
    : null;

  return (
    <Frame className={styles.frame}>
      <div>Odometer:</div>
      <div>{distance !== null ? distance.toFixed(2) : '-'} m</div>
    </Frame>
  );
}
