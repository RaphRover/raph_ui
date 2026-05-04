import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SteeringModes,
  type AckermannDriveMsg,
  type SteeringMode,
  type TurnInPlaceDriveMsg,
} from '@/types/rosInterfaces';
import useRosTopicPublisher from './useRosTopicPublisher';
import { useConfigContext } from '@/config';

type RobotVelocityCommand = {
  speed: number;
  steering_angle: number;
  angular_velocity: number;
};

export interface RobotVelocityControl {
  isDrivingEnabled: boolean;
  setDrivingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setRobotVelocity: (command: RobotVelocityCommand) => void;
}

export default function useRobotVelocityControl(
  steeringMode: SteeringMode | null,
  isSteeringReversed: boolean,
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
  const publishTurnInPlaceVelocity = useRosTopicPublisher<TurnInPlaceDriveMsg>(
    'controller/cmd_turn_in_place',
    'raph_interfaces/msg/TurnInPlaceDrive',
  );

  const latestCommandRef = useRef<RobotVelocityCommand>({
    speed: 0,
    steering_angle: 0,
    angular_velocity: 0,
  });

  const setRobotVelocity = useCallback((command: RobotVelocityCommand) => {
    latestCommandRef.current = command;
  }, []);

  useEffect(() => {
    if (!isDrivingEnabled) {
      latestCommandRef.current = {
        speed: 0,
        steering_angle: 0,
        angular_velocity: 0,
      };
    }
  }, [isDrivingEnabled]);

  useEffect(() => {
    if (!isDrivingEnabled) return;

    const interval = setInterval(() => {
      const { speed, steering_angle, angular_velocity } =
        latestCommandRef.current;
      const effectiveSpeed = isSteeringReversed ? -speed : speed;
      const effectiveSteeringAngle = isSteeringReversed
        ? -steering_angle
        : steering_angle;
      const effectiveAngularVelocity = isSteeringReversed
        ? -angular_velocity
        : angular_velocity;
      if (steeringMode === SteeringModes.TURN_IN_PLACE) {
        publishTurnInPlaceVelocity({
          angular_velocity: effectiveAngularVelocity,
          acceleration: turnInPlaceAcceleration,
        });
      } else {
        const velocity = {
          steering_angle: effectiveSteeringAngle,
          steering_angle_velocity: steeringAngleVelocityRadps,
          speed: effectiveSpeed,
          acceleration: ackermannAcceleration,
          jerk: ackermannJerk,
        };
        publishAckermannVelocity(velocity);
      }
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
    isSteeringReversed,
    steeringMode,
    turnInPlaceAcceleration,
    velocityPublishIntervalMs,
  ]);

  return {
    isDrivingEnabled,
    setDrivingEnabled,
    setRobotVelocity,
  };
}
