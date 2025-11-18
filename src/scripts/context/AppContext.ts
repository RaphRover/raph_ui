import type { StreamTopic } from '@scripts/hooks/useRosStreamList';
import { createContext, useContext } from 'react';
import type { RobotVelocityControl } from '@scripts/hooks/useRobotVelocityControl';
import type { SteeringModeHook } from '@scripts/hooks/useSteeringMode';
import type { WheelCalibration } from '@scripts/hooks/useWheelCalibration';

interface AppContext {
  isMenuVisible: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStream: StreamTopic | null;
  selectStream: React.Dispatch<React.SetStateAction<StreamTopic | null>>;
  robotVelocityControl: RobotVelocityControl;
  isKeyboardControlEnabled: boolean;
  setKeyboardControlEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isVirtualJoystickEnabled: boolean;
  setVirtualJoystickEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  steeringMode: SteeringModeHook;
  wheelCalibration: WheelCalibration;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
