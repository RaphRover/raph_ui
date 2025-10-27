import Frame from '@components/ui/Frame';
import useRosTopicSubscription from '@scripts/hooks/useRosTopicSubscription';
import { clsx } from 'clsx';
import { IMU_CONFIG } from '@scripts/config/config';

import type { Quaternion } from 'roslib';
import type { ImuMsg } from 'types/rosInterfaces';

import styles from './styles.module.css';

interface Euler {
  roll: number;
  pitch: number;
  yaw: number;
}

export default function ImuReadings() {
  const { REFRESH_INTERVAL_MS, DISPLAY_PRECISION } = IMU_CONFIG;
  const imuReadings = useRosTopicSubscription<ImuMsg>(
    'controller/imu/data',
    'sensor_msgs/msg/Imu',
    REFRESH_INTERVAL_MS,
  );

  const radToDeg = (rad: number) => (rad * 180) / Math.PI;

  const quaternionToEuler = (q: Quaternion): Euler => {
    const { x, y, z, w } = q;
    const euler: Euler = { roll: 0, pitch: 0, yaw: 0 };

    // Roll (x-axis rotation)
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    euler.roll = Math.atan2(sinr_cosp, cosr_cosp);

    // Pitch (y-axis rotation)
    // We need to handle the singularity at north and south poles (gimbal lock)
    const sinp = 2 * (w * y - z * x);
    if (Math.abs(sinp) >= 1) {
      // Use 90 degrees if out of range, as asin() is undefined past 1.
      euler.pitch = Math.sign(sinp) * (Math.PI / 2);
    } else {
      euler.pitch = Math.asin(sinp);
    }

    // Yaw (z-axis rotation)
    const siny_cosp = 2 * (w * z + x * y);
    const cosy_cosp = 1 - 2 * (y * y + z * z);
    euler.yaw = Math.atan2(siny_cosp, cosy_cosp);

    return euler;
  };

  let euler = null;
  if (imuReadings) euler = quaternionToEuler(imuReadings.orientation);

  return (
    <Frame>
      <div>IMU readings:</div>
      <div>
        <span className={styles.angle}>
          Roll: {euler ? radToDeg(euler.roll).toFixed(DISPLAY_PRECISION) : '-'}°
        </span>
        <span className={clsx(styles.angle, styles.spacing)}>
          Pitch:{' '}
          {euler ? radToDeg(euler.pitch).toFixed(DISPLAY_PRECISION) : '-'}°
        </span>
        <span className={styles.angle}>
          Yaw: {euler ? radToDeg(euler.yaw).toFixed(DISPLAY_PRECISION) : '-'}°
        </span>
      </div>
    </Frame>
  );
}
