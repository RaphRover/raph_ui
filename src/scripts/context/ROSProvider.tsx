import useRos from '@scripts/hooks/useRos';
import { ROSContext } from '@scripts/context/ROSContext';
import { config } from '@scripts/config/config';
import useRosTopicManager from '@scripts/hooks/useRosTopicManager';
import useRosTopicList from '@scripts/hooks/useRosTopicList';

export const ROSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { rosIp, intervals } = config;
  const ros = useRos(rosIp, intervals.rosReconnect);
  const topicManager = useRosTopicManager(ros);
  const topicList = useRosTopicList( ros );
  console.debug('[ROSProvider] Rendering ROSProvider' , topicList);

  return (
    <ROSContext.Provider value={{ ros, topicList , topicManager }}>
      {children}
    </ROSContext.Provider>
  );
};
