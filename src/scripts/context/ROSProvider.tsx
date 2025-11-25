import useRos from '@scripts/hooks/useRos';
import { ROSContext } from '@scripts/context/ROSContext';
import useRosTopicManager from '@scripts/hooks/useRosTopicManager';
import useRosTopicList from '@scripts/hooks/useRosTopicList';
import useRosStreamList from '@scripts/hooks/useRosStreamList';
import { useConfigContext } from './ConfigContext';

export const ROSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { rosConfig } = useConfigContext();
  const { HOSTNAME, PORT, RECONNECT_INTERVAL_MS, TOPIC_POLL_INTERVAL_MS } =
    rosConfig;
  const ros = useRos(HOSTNAME, PORT, RECONNECT_INTERVAL_MS);
  const topicManager = useRosTopicManager(ros);
  const topicList = useRosTopicList(ros, TOPIC_POLL_INTERVAL_MS);
  const streamList = useRosStreamList(topicList);

  return (
    <ROSContext.Provider value={{ ros, topicList, topicManager, streamList }}>
      {children}
    </ROSContext.Provider>
  );
};
