import type {
  RosConfig,
  BatteryConfig,
  ImuConfig,
  DriveConfig,
  GamepadConfig,
  VirtualGamepadConfig,
} from '@scripts/config/config';
import { createContext, useContext } from 'react';

interface ConfigContext {
  rosConfig: RosConfig;
  setRosConfig: React.Dispatch<React.SetStateAction<RosConfig>>;
  initialStreamName: string;
  setInitialStreamName: React.Dispatch<React.SetStateAction<string>>;
  batteryConfig: BatteryConfig;
  setBatteryConfig: React.Dispatch<React.SetStateAction<BatteryConfig>>;
  imuConfig: ImuConfig;
  setImuConfig: React.Dispatch<React.SetStateAction<ImuConfig>>;
  driveConfig: DriveConfig;
  setDriveConfig: React.Dispatch<React.SetStateAction<DriveConfig>>;
  gamepadConfig: GamepadConfig;
  setGamepadConfig: React.Dispatch<React.SetStateAction<GamepadConfig>>;
  virtualGamepadConfig: VirtualGamepadConfig;
  setVirtualGamepadConfig: React.Dispatch<
    React.SetStateAction<VirtualGamepadConfig>
  >;
}

export const ConfigContext = createContext<ConfigContext | undefined>(
  undefined,
);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};
