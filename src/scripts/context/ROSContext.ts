import { createContext, useContext } from 'react';
import { Ros } from 'roslib';
import type { TopicManager } from '@scripts/hooks/useRosTopicManager';
import type { RosTopic } from '@scripts/hooks/useRosTopicList';
import type { StreamTopic } from '@scripts/hooks/useRosStreamList';

interface ROSContextProps {
  ros: Ros | null;
  topicManager: TopicManager;
  topicList: RosTopic[];
  streamList: StreamTopic[];
}

export const ROSContext = createContext<ROSContextProps | undefined>(undefined);

export const useROSContext = () => {
  const context = useContext(ROSContext);
  if (!context) {
    throw new Error('useROSContext must be used within a ROSProvider');
  }
  return context;
};
