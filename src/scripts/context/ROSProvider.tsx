import useROS from '@scripts/hooks/useROS';
import { ROSContext } from '@scripts/context/ROSContext';
import { config } from '@scripts/config/config';

export const ROSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { rosIp, intervals } = config;
  const ros = useROS(rosIp, intervals.rosReconnect);

  return <ROSContext.Provider value={{ ros }}>{children}</ROSContext.Provider>;
};
