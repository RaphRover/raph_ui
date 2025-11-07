import { useMemo, useState } from 'react';
import { AppContext } from './AppContext';
import type { StreamTopic } from '@scripts/hooks/useRosStreamList';
import { useROSContext } from './ROSContext';
import { DEFAULT_STREAM_NAME } from '@scripts/config/config';
import useRobotVelocityControl from '@scripts/hooks/useRobotVelocityControl';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Driving
  const [isKeyboardControlEnabled, setKeyboardControlEnabled] = useState(false);
  const [isVirtualJoystickEnabled, setVirtualJoystickEnabled] = useState(false);

  const [selectedStream, selectStream] = useState<StreamTopic | null>(null);

  const { streamList } = useROSContext();

  const effectiveSelectedStream = useMemo(() => {
    const defaultStream = streamList.find(
      (stream) => stream.name === DEFAULT_STREAM_NAME,
    );
    return selectedStream ?? defaultStream ?? null;
  }, [selectedStream, streamList]);

  const robotVelocityControl = useRobotVelocityControl();

  return (
    <AppContext.Provider
      value={{
        isMenuVisible,
        setMenuVisible,
        selectedStream: effectiveSelectedStream,
        selectStream,
        robotVelocityControl,
        isKeyboardControlEnabled,
        setKeyboardControlEnabled,
        isVirtualJoystickEnabled,
        setVirtualJoystickEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
