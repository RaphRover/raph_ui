import { useState } from 'react';
import { ConfigContext } from './ConfigContext';
import {
  DEFAULT_BATTERY_CONFIG,
  DEFAULT_IMU_CONFIG,
  DEFAULT_INITIAL_STREAM_NAME,
  DEFAULT_ROS_CONFIG,
  DEFAULT_DRIVE_CONFIG,
  DEFAULT_GAMEPAD_CONFIG,
  DEFAULT_VIRTUAL_GAMEPAD_CONFIG,
} from '@scripts/config/config';
import type {
  DriveConfig,
  GamepadConfig,
  VirtualGamepadConfig,
  BatteryConfig,
  ImuConfig,
  RosConfig,
} from '@scripts/config/config';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rosConfig, setRosConfig] = useState<RosConfig>(DEFAULT_ROS_CONFIG);
  const [initialStreamName, setInitialStreamName] = useState<string>(
    DEFAULT_INITIAL_STREAM_NAME,
  );
  const [batteryConfig, setBatteryConfig] = useState<BatteryConfig>(
    DEFAULT_BATTERY_CONFIG,
  );
  const [imuConfig, setImuConfig] = useState<ImuConfig>(DEFAULT_IMU_CONFIG);
  const [driveConfig, setDriveConfig] =
    useState<DriveConfig>(DEFAULT_DRIVE_CONFIG);
  const [gamepadConfig, setGamepadConfig] = useState<GamepadConfig>(
    DEFAULT_GAMEPAD_CONFIG,
  );
  const [virtualGamepadConfig, setVirtualGamepadConfig] =
    useState<VirtualGamepadConfig>(DEFAULT_VIRTUAL_GAMEPAD_CONFIG);
  return (
    <ConfigContext.Provider
      value={{
        rosConfig,
        setRosConfig,
        initialStreamName,
        setInitialStreamName,
        batteryConfig,
        setBatteryConfig,
        imuConfig,
        setImuConfig,
        driveConfig,
        setDriveConfig,
        gamepadConfig,
        setGamepadConfig,
        virtualGamepadConfig,
        setVirtualGamepadConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
