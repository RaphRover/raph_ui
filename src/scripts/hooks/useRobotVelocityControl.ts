import { useCallback, useEffect, useRef, useState } from 'react';
import type { AckermannDriveMsg } from 'types/rosInterfaces';
import useRosTopicPublisher from './useRosTopicPublisher';
import { SteeringModes } from '@root/src/types/rosInterfaces';
import type { SteeringMode } from '@scripts/hooks/useSteeringMode';
import { useConfigContext } from '@scripts/context/ConfigContext';

export interface RobotVelocityControl {
  isDrivingEnabled: boolean;
  setDrivingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setRobotVelocity: (velocity: Partial<AckermannDriveMsg>) => void;
}

export default function useRobotVelocityControl(
  steeringMode: SteeringMode | null,
): RobotVelocityControl {
  const { driveConfig } = useConfigContext();
  const [isDrivingEnabled, setDrivingEnabled] = useState(false);

  const {
    VELOCITY_PUBLISH_INTERVAL_MS: publishInterval,
    ACKERMANN_STEERING_ANGLE_VELOCITY,
    ACKERMANN_ACCELERATION,
    ACKERMANN_JERK,
  } = driveConfig;

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
      const velocity = { ...robotVelocityRef.current };
      if (steeringMode === SteeringModes.TURN_IN_PLACE) {
        const tempSpeed = velocity.speed;
        velocity.speed = -velocity.steering_angle;
        velocity.steering_angle = tempSpeed;
      }
      publishVelocity(velocity);
    }, publishInterval);
    console.debug('[useRobotVelocityControl] Velocity publish enabled');

    return () => {
      clearInterval(interval);
      console.debug('[useRobotVelocityControl] Velocity publish disabled');
    };
  }, [isDrivingEnabled, publishInterval, publishVelocity, steeringMode]);

  return { isDrivingEnabled, setDrivingEnabled, setRobotVelocity };
}
