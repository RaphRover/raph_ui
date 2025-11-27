import { useCallback, useMemo, useState } from 'react';
import type { AppSettings, RecursivePartial } from './types';
import { getInitialSettings } from './inferred';
import { deepMerge } from './utils';
import { ConfigContext } from './ConfigContext';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    return getInitialSettings();
  });

  const updateSettings = useCallback(
    (partialChanges: RecursivePartial<AppSettings>) => {
      setSettings((prevSettings) => {
        const newSettings = deepMerge(prevSettings, partialChanges);
        return newSettings;
      });
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
    }),
    [settings, updateSettings],
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};
