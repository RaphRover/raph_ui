import { useRosContext } from '@/scripts/context/RosContext';
import { useCallback, useEffect, useState } from 'react';

export default function useRosTopicSubscription<T>(
  name: string,
  messageType: string,
  updateInterval: number = 100,
): T | null {
  const { ros, topicManager } = useRosContext();
  const { subscribe, unsubscribe } = topicManager;

  const [topicData, setTopicData] = useState<T | null>(null);

  const handleMessage = useCallback((message: unknown) => {
    setTopicData(message as T);
  }, []);

  useEffect(() => {
    if (!ros) return;

    subscribe(name, messageType, handleMessage, updateInterval);
    console.debug(`[useRosTopicSubscription] Subscribed to topic: ${name}`);

    return () => {
      unsubscribe(name, handleMessage);
      setTopicData(null);
      console.debug(
        `[useRosTopicSubscription] Unsubscribed from topic: ${name}`,
      );
    };
  }, [
    ros,
    name,
    messageType,
    updateInterval,
    subscribe,
    unsubscribe,
    handleMessage,
  ]);

  return topicData;
}
