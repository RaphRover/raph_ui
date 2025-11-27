import { createContext, useContext } from 'react';
import type { AppSettings, RecursivePartial } from './types';

type ConfigContextType = {
  settings: AppSettings;
  updateSettings: (updates: RecursivePartial<AppSettings>) => void;
};

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined,
);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};
