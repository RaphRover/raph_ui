import useRos from '@scripts/hooks/useRos';
import { ROSContext } from '@scripts/context/ROSContext';
import { config } from '@scripts/config/config';
import useRosTopicManager from '@scripts/hooks/useRosTopicManager';

export const ROSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { rosIp, intervals } = config;
  const ros = useRos(rosIp, intervals.rosReconnect);
  const topicManager = useRosTopicManager(ros);

  return (
    <ROSContext.Provider value={{ ros, topicManager }}>
      {children}
    </ROSContext.Provider>
  );
};
