import { Quaternion, Vector3 } from 'roslib';

export interface BatteryModeMsg {
  charging: boolean;
  draining: boolean;
}

export interface BatteryStateMsg {
  voltage: number;
  state_of_charge: number;
  target_mode: BatteryModeMsg;
  current_mode: BatteryModeMsg;
}

export interface PowerSystemStateMsg {
  bat1_connected: boolean;
  bat2_connected: boolean;
  power: number;
  energy: number;
  bat1_state: BatteryStateMsg;
  bat2_state: BatteryStateMsg;
}

type CovarianceArray = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export interface ImuMsg {
  orientation: Quaternion;
  orientation_covariance: CovarianceArray;
  angular_velocity: Vector3;
  angular_velocity_covariance: CovarianceArray;
  linear_acceleration: Vector3;
  linear_acceleration_covariance: CovarianceArray;
}

export interface ServiceResponse {
  success?: boolean;
  status_message?: string;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface GetControllerInfoResponse extends ServiceResponse {
  bootloader_version: string;
  firmware_version: string;
  extra_information: KeyValue[];
}

export interface GetOsVersionResponse extends ServiceResponse {
  version: string;
  variant: string;
  major: number;
  minor: number;
  patch: number;
}

export const SteeringModes = {
  ACKERMANN: 0,
  TURN_IN_PLACE: 1,
} as const;

export type SteeringMode = (typeof SteeringModes)[keyof typeof SteeringModes];

export type SteeringModeMsg = {
  data: SteeringMode;
};

export type SteeringModeRequest = {
  steering_mode: SteeringModeMsg;
};

export const DrivetrainOperatingStates = {
  DISABLED: 0,
  ENABLED: 1,
  CALIBRATING_SERVOS: 2,
  CHANGING_STEERING_MODE: 3,
} as const;

export type DrivetrainOperatingState =
  (typeof DrivetrainOperatingStates)[keyof typeof DrivetrainOperatingStates];

export interface DrivetrainStateMsg {
  steering_mode: SteeringModeMsg;
  operating_state: DrivetrainOperatingState;
  is_servos_calibrated: boolean;
}

export interface AckermannDriveMsg {
  steering_angle: number;
  steering_angle_velocity: number;
  speed: number;
  acceleration: number;
  jerk: number;
}

export interface TurnInPlaceDriveMsg {
  angular_velocity: number;
  acceleration: number;
}

export const LED_STRIP_SIZE = 143;

export interface LedColorMsg {
  red: number;
  green: number;
  blue: number;
  white: number;
}

export interface LedStateMsg {
  duration: number;
  priority: number;
  color: LedColorMsg;
}

export interface LedStripStateMsg {
  state: LedStateMsg[];
}
