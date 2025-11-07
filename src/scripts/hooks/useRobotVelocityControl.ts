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

  const {
    ACKERMANN_STEERING_ANGLE_VELOCITY,
    ACKERMANN_ACCELERATION,
    ACKERMANN_JERK,
  } = DRIVE_CONFIG;

  const publishVelocity = useRosTopicPublisher<AckermannDriveMsg>(
    'controller/cmd_ackermann',
    'ackermann_msgs/msg/AckermannDrive',
  );

  const robotVelocityRef = useRef<AckermannDriveMsg>({
    steering_angle: 0,
    steering_angle_velocity: ACKERMANN_STEERING_ANGLE_VELOCITY,
    speed: 0,
    acceleration: ACKERMANN_ACCELERATION,
    jerk: ACKERMANN_JERK,
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
