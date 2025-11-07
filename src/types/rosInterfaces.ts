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
  success: boolean;
  status_message: string;
}

export const SteeringModes = {
  ACKERMANN: 0,
  TURN_IN_PLACE: 1,
} as const;

export type SteeringModeRequest =
  (typeof SteeringModes)[keyof typeof SteeringModes];
