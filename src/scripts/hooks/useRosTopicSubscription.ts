import { useROSContext } from '@scripts/context/ROSContext';
import { useEffect } from 'react';

export default function useRosTopicSubscription<T>(
  name: string,
  messageType: string,
  updateInterval: number = 100,
): T | null {
  const { ros, topicManager } = useROSContext();
  const { topicData, subscribe, unsubscribe } = topicManager;

  useEffect(() => {
    if (!ros) return;

    subscribe(name, messageType, updateInterval);
    console.debug(`[useRosTopicSubscription] Subscribed to topic: ${name}`);

    return () => {
      unsubscribe(name);
      console.debug(
        `[useRosTopicSubscription] Unsubscribed from topic: ${name}`,
      );
    };
  }, [ros, name, messageType, updateInterval, subscribe, unsubscribe]);

  const data = (topicData[name] as T) ?? null;

  return data;
}
