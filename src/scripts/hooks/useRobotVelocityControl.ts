import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SteeringModes,
  type AckermannDriveMsg,
  type SteeringMode,
  type TurnInPlaceDriveMsg,
} from '@/types/rosInterfaces';
import useRosTopicPublisher from './useRosTopicPublisher';
import { useConfigContext } from '@/config';

export interface RobotVelocityControl {
  isDrivingEnabled: boolean;
  setDrivingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setRobotVelocity: (velocity: Partial<AckermannDriveMsg>) => void;
}

export default function useRobotVelocityControl(
  steeringMode: SteeringMode | null,
): RobotVelocityControl {
  const { settings } = useConfigContext();

  const [isDrivingEnabled, setDrivingEnabled] = useState(false);
  const {
    velocityPublishIntervalMs,
    ackermannAcceleration,
    ackermannJerk,
    steeringAngleVelocityRadps,
    turnInPlaceAcceleration,
  } = settings.driveConfig;

  const publishAckermannVelocity = useRosTopicPublisher<AckermannDriveMsg>(
    'controller/cmd_ackermann',
    'ackermann_msgs/msg/AckermannDrive',
  );
  const publishTurnInPlaceVelocity =
    useRosTopicPublisher<TurnInPlaceDriveMsg>(
      'controller/cmd_turn_in_place',
      'raph_interfaces/msg/TurnInPlaceDrive',
    );

  const robotVelocityRef = useRef<AckermannDriveMsg>({
    steering_angle: 0,
    steering_angle_velocity: steeringAngleVelocityRadps,
    speed: 0,
    acceleration: ackermannAcceleration,
    jerk: ackermannJerk,
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
      if (steeringMode === SteeringModes.TURN_IN_PLACE) {
        publishTurnInPlaceVelocity({
          angular_velocity: -robotVelocityRef.current.steering_angle,
          acceleration: turnInPlaceAcceleration,
        });
        return;
      }

      const velocity = {
        ...robotVelocityRef.current,
        steering_angle_velocity: steeringAngleVelocityRadps,
        acceleration: ackermannAcceleration,
        jerk: ackermannJerk,
      };
      publishAckermannVelocity(velocity);
    }, velocityPublishIntervalMs);
    console.debug('[useRobotVelocityControl] Velocity publish enabled');

    return () => {
      clearInterval(interval);
      console.debug('[useRobotVelocityControl] Velocity publish disabled');
    };
  }, [
    ackermannAcceleration,
    ackermannJerk,
    isDrivingEnabled,
    publishAckermannVelocity,
    publishTurnInPlaceVelocity,
    steeringAngleVelocityRadps,
    steeringMode,
    turnInPlaceAcceleration,
    velocityPublishIntervalMs,
  ]);

  return { isDrivingEnabled, setDrivingEnabled, setRobotVelocity };
}
