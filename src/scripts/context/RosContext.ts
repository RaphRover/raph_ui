import { createContext, useContext } from 'react';
import { Ros } from 'roslib';
import type { TopicManager } from '@/scripts/hooks/useRosTopicManager';
import type { RosTopic } from '@/scripts/hooks/useRosTopicList';
import type { StreamTopic } from '@/scripts/hooks/useRosStreamList';

interface RosContextProps {
  ros: Ros | null;
  topicManager: TopicManager;
  topicList: RosTopic[];
  streamList: StreamTopic[];
}

export const RosContext = createContext<RosContextProps | undefined>(undefined);

export const useRosContext = () => {
  const context = useContext(RosContext);
  if (!context) {
    throw new Error('useRosContext must be used within a RosProvider');
  }
  return context;
};
