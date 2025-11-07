import { useCallback, useEffect, useRef, useState } from 'react';
import type { AckermannDriveMsg } from 'types/rosInterfaces';
import useRosTopicPublisher from './useRosTopicPublisher';
import { DRIVE_CONFIG } from '@scripts/config/config';

export interface RobotVelocityControl {
  isDrivingEnabled: boolean;
  setDrivingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setRobotVelocity: (velocity: Partial<AckermannDriveMsg>) => void;
}

export default function useRobotVelocityControl(): RobotVelocityControl {
  const [isDrivingEnabled, setDrivingEnabled] = useState(false);
  const publishInterval = DRIVE_CONFIG.VELOCITY_PUBLISH_INTERVAL_MS;

  const publishVelocity = useRosTopicPublisher<AckermannDriveMsg>(
    'controller/cmd_ackermann',
    'ackermann_msgs/msg/AckermannDrive',
  );

  const robotVelocityRef = useRef<AckermannDriveMsg>({
    steering_angle: 0,
    steering_angle_velocity: 0,
    speed: 0,
    acceleration: 0,
    jerk: 0,
  });

  const setRobotVelocity = useCallback(
    (velocity: Partial<AckermannDriveMsg>) => {
      const prevVelocity = robotVelocityRef.current;
      robotVelocityRef.current = {
        ...prevVelocity,
        ...velocity,
      };
    },
    [],
  );

  useEffect(() => {
    if (!isDrivingEnabled) return;

    const interval = setInterval(() => {
      const velocity = robotVelocityRef.current;
      publishVelocity(velocity);
    }, publishInterval);
    console.debug('[useRobotVelocityControl] Velocity publish enabled');

    return () => {
      clearInterval(interval);
      console.debug('[useRobotVelocityControl] Velocity publish disabled');
    };
  }, [isDrivingEnabled, publishInterval, publishVelocity]);

  return { isDrivingEnabled, setDrivingEnabled, setRobotVelocity };
}
