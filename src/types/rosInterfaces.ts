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
