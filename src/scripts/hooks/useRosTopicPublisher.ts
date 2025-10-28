import { useROSContext } from '@scripts/context/ROSContext';
import { useCallback, useEffect } from 'react';
import type { RosMessage } from './useRosTopicManager';

export default function useRosTopicPublisher<T>(
  topicName: string,
  messageType: string,
): (message: T) => void {
  const { topicManager } = useROSContext();

  const publish = useCallback(
    (message: T) => {
      topicManager?.publish(topicName, messageType, message as RosMessage);
    },
    [topicManager, topicName, messageType],
  );

  useEffect(() => {
    return () => {
      topicManager.removePublisher(topicName);
    };
  }, [topicManager, topicName]);

  return publish;
}
