import { useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import type { StreamTopic } from '@scripts/hooks/useRosStreamList';
import { useROSContext } from './ROSContext';
import { DEFAULT_STREAM_NAME } from '@scripts/config/config';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedStream, selectStream] = useState<StreamTopic | null>(null);

  const { streamList } = useROSContext();

  // Default stream selection
  useEffect(() => {
    if (selectedStream || streamList.length === 0) return;
    const defaultStream = streamList.find(
      (stream) => stream.name === DEFAULT_STREAM_NAME,
    );

    if (defaultStream) {
      console.debug('[AppProvider] Default stream set:', defaultStream.name);
      selectStream(defaultStream);
    } else {
      console.warn(
        '[AppProvider] Could not find defaut stream:',
        DEFAULT_STREAM_NAME,
      );
    }
  }, [selectedStream, streamList]);

  return (
    <AppContext.Provider
      value={{ isMenuVisible, setMenuVisible, selectedStream, selectStream }}
    >
      {children}
    </AppContext.Provider>
  );
};
