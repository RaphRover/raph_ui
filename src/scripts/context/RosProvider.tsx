import useRos from '@/scripts/hooks/useRos';
import { RosContext } from '@/scripts/context/RosContext';
import useRosTopicManager from '@/scripts/hooks/useRosTopicManager';
import useRosTopicList from '@/scripts/hooks/useRosTopicList';
import useRosStreamList from '@/scripts/hooks/useRosStreamList';
import { useConfigContext } from '../../config/ConfigContext';

export const RosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useConfigContext();
  const { hostname, port, reconnectIntervalMs, topicPollIntervalMs } =
    settings.ros;
  const ros = useRos(hostname, port, reconnectIntervalMs);
  const topicManager = useRosTopicManager(ros);
  const topicList = useRosTopicList(ros, topicPollIntervalMs);
  const streamList = useRosStreamList(topicList);

  return (
    <RosContext.Provider value={{ ros, topicList, topicManager, streamList }}>
      {children}
    </RosContext.Provider>
  );
};
