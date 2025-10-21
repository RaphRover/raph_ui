import { createContext, useContext } from 'react';
import * as ROSLIB from 'roslib';
import type { TopicManager } from '@scripts/hooks/useRosTopicManager';

interface ROSContextProps {
  ros: ROSLIB.Ros | null;
  topicManager: TopicManager;
}

export const ROSContext = createContext<ROSContextProps | undefined>(undefined);

export const useROSContext = () => {
  const context = useContext(ROSContext);
  if (!context) {
    throw new Error('useROSContext must be used within a ROSProvider');
  }
  return context;
};
