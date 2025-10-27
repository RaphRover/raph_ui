import { useState } from 'react';
import { AppContext } from './AppContext';
import type { StreamTopic } from '@scripts/hooks/useRosStreamList';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedStream, selectStream] = useState<StreamTopic | null>(null);

  return (
    <AppContext.Provider
      value={{ isMenuVisible, setMenuVisible, selectedStream, selectStream }}
    >
      {children}
    </AppContext.Provider>
  );
};
