import type { StreamTopic } from '@scripts/hooks/useRosStreamList';
import { createContext, useContext } from 'react';

interface AppContext {
  isMenuVisible: boolean;
  setMenuVisible: (status: boolean) => void;
  selectedStream: StreamTopic | null;
  selectStream: (status: StreamTopic | null) => void;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
