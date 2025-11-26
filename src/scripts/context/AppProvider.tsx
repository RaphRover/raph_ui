import { useMemo, useState } from 'react';
import { AppContext } from './AppContext';
import type { StreamTopic } from '@/scripts/hooks/useRosStreamList';
import { useRosContext } from './RosContext';
import useRobotVelocityControl from '@/scripts/hooks/useRobotVelocityControl';
import useSteeringMode from '@/scripts/hooks/useSteeringMode';
import useWheelCalibration from '@/scripts/hooks/useWheelCalibration';
import useSystemServices from '@/scripts/hooks/useSystemServices';
import { useConfigContext } from '../../config/ConfigContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useConfigContext();
  const defaultStreamName = settings.defaultStream;
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isConfigVisible, setConfigVisible] = useState(false);

  // Driving
  const [isKeyboardControlEnabled, setKeyboardControlEnabled] = useState(false);
  const [isVirtualGamepadEnabled, setVirtualGamepadEnabled] = useState(false);

  const [selectedStream, selectStream] = useState<StreamTopic | null>(null);

  const { streamList } = useRosContext();

  const effectiveSelectedStream = useMemo(() => {
    const defaultStream = streamList.find(
      (stream) => stream.name === defaultStreamName,
    );
    return selectedStream ?? defaultStream ?? null;
  }, [defaultStreamName, selectedStream, streamList]);

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
