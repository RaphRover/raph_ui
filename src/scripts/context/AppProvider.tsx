import { useMemo, useState } from 'react';
import { AppContext } from './AppContext';
import type { StreamTopic } from '@scripts/hooks/useRosStreamList';
import { useROSContext } from './ROSContext';
import { DEFAULT_STREAM_NAME } from '@scripts/config/config';
import useRobotVelocityControl from '@scripts/hooks/useRobotVelocityControl';
import useSteeringMode from '@scripts/hooks/useSteeringMode';
import useWheelCalibration from '@scripts/hooks/useWheelCalibration';
import useSystemServices from '@scripts/hooks/useSystemServices';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isConfigVisible, setConfigVisible] = useState(false);

  // Driving
  const [isKeyboardControlEnabled, setKeyboardControlEnabled] = useState(false);
  const [isVirtualGamepadEnabled, setVirtualGamepadEnabled] = useState(false);

  const [selectedStream, selectStream] = useState<StreamTopic | null>(null);

  const { streamList } = useROSContext();

  const effectiveSelectedStream = useMemo(() => {
    const defaultStream = streamList.find(
      (stream) => stream.name === DEFAULT_STREAM_NAME,
    );
    return selectedStream ?? defaultStream ?? null;
  }, [selectedStream, streamList]);

  const steeringMode = useSteeringMode();
  const wheelCalibration = useWheelCalibration();

  const robotVelocityControl = useRobotVelocityControl(
    steeringMode.steeringMode,
  );

  const systemServices = useSystemServices();

  return (
    <AppContext.Provider
      value={{
        isMenuVisible,
        setMenuVisible,
        isConfigVisible,
        setConfigVisible,
        selectedStream: effectiveSelectedStream,
        selectStream,
        robotVelocityControl,
        isKeyboardControlEnabled,
        setKeyboardControlEnabled,
        isVirtualGamepadEnabled,
        setVirtualGamepadEnabled,
        steeringMode,
        wheelCalibration,
        systemServices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
