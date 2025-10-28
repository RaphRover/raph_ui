import useRos from '@scripts/hooks/useRos';
import { ROSContext } from '@scripts/context/ROSContext';
import { ROS_CONFIG } from '@scripts/config/config';
import useRosTopicManager from '@scripts/hooks/useRosTopicManager';
import useRosTopicList from '@scripts/hooks/useRosTopicList';
import useRosStreamList from '@scripts/hooks/useRosStreamList';

export const ROSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { HOSTNAME, PORT, RECONNECT_INTERVAL_MS, TOPIC_POLL_INTERVAL_MS } =
    ROS_CONFIG;
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
