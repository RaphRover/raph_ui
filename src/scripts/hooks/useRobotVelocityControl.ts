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

export type DirectionLock = 'forward' | 'backward' | null;

export interface RobotVelocityControl {
  isDrivingEnabled: boolean;
  setDrivingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isGuidedSteeringEnabled: boolean;
  setGuidedSteeringEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  directionLock: DirectionLock;
  setDirectionLock: React.Dispatch<React.SetStateAction<DirectionLock>>;
  setRobotVelocity: (command: RobotVelocityCommand) => void;
}

export default function useRobotVelocityControl(
  steeringMode: SteeringMode | null,
  isSteeringReversed: boolean,
): RobotVelocityControl {
  const { settings } = useConfigContext();

  const [isDrivingEnabled, setDrivingEnabled] = useState(false);
  const [isGuidedSteeringEnabled, setGuidedSteeringEnabled] = useState(true);
  const [directionLock, setDirectionLock] = useState<DirectionLock>(null);
  const {
    velocityPublishIntervalMs,
    linearVelocityMps,
    ackermannAcceleration,
    ackermannJerk,
    steeringAngleVelocityRadps,
    turnInPlaceAcceleration,
  } = settings.driveConfig;

  const ackermannTopic = isGuidedSteeringEnabled
    ? 'pds_pipe_guide/cmd_ackermann'
    : 'controller/cmd_ackermann';

  const publishAckermannVelocity = useRosTopicPublisher<AckermannDriveMsg>(
    ackermannTopic,
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
      setDirectionLock(null);
    }
  }, [isDrivingEnabled]);

  useEffect(() => {
    if (!isGuidedSteeringEnabled) {
      setDirectionLock(null);
    }
  }, [isGuidedSteeringEnabled]);

  useEffect(() => {
    if (!isDrivingEnabled) return;

    const interval = setInterval(() => {
      let { speed, steering_angle, angular_velocity } =
        latestCommandRef.current;

      if (isGuidedSteeringEnabled && directionLock !== null) {
        speed =
          directionLock === 'forward'
            ? linearVelocityMps
            : -linearVelocityMps;
        steering_angle = 0;
        angular_velocity = 0;
      }

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
    directionLock,
    isDrivingEnabled,
    isGuidedSteeringEnabled,
    linearVelocityMps,
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
    isGuidedSteeringEnabled,
    setGuidedSteeringEnabled,
    directionLock,
    setDirectionLock,
    setRobotVelocity,
  };
}
