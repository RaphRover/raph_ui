import { useCallback, useRef } from 'react';
import { Ros, Topic } from 'roslib';

type RosMessage = Record<string, unknown>;
type SubscriptionCallback = (message: RosMessage) => void;

export type TopicManager = {
  subscribe: (
    topicName: string,
    messageType: string,
    callback: SubscriptionCallback,
    updateInterval?: number,
  ) => void;
  unsubscribe: (topicName: string, callback: SubscriptionCallback) => void;
};

export default function useRosTopicManager(ros: Ros | null): TopicManager {
  const subscriptions = useRef<{ [key: string]: Topic<RosMessage> }>({});
  const callbacks = useRef<{ [key: string]: Set<SubscriptionCallback> }>({});

  const subscribe = useCallback(
    (
      topicName: string,
      messageType: string,
      callback: SubscriptionCallback,
      updateInterval: number = 100,
    ) => {
      if (!ros) return;

      // First subscription for this topic
      if (!subscriptions.current[topicName]) {
        const topic = new Topic<RosMessage>({
          ros,
          name: topicName,
          messageType,
          throttle_rate: updateInterval,
        });

        topic.subscribe((message: RosMessage) => {
          callbacks.current[topicName]?.forEach((cb) => cb(message));
        });

        subscriptions.current[topicName] = topic;
        callbacks.current[topicName] = new Set();
        console.debug(
          `[useRosTopicManager] Created ROS subscription for: ${topicName}`,
        );
      }

      callbacks.current[topicName].add(callback);
      console.debug(
        `[useRosTopicManager] Added consumer for topic: ${topicName}`,
      );
    },
    [ros],
  );

  const unsubscribe = useCallback(
    (topicName: string, callback: SubscriptionCallback) => {
      if (!ros || !callbacks.current[topicName]) return;

      callbacks.current[topicName].delete(callback);
      console.debug(
        `[useRosTopicManager] Removed consumer for topic: ${topicName}`,
      );

      if (callbacks.current[topicName].size === 0) {
        subscriptions.current[topicName]?.unsubscribe();
        delete subscriptions.current[topicName];
        delete callbacks.current[topicName];
        console.debug(
          `[useRosTopicManager] Closed ROS subscription for: ${topicName}`,
        );
      }
    },
    [ros],
  );

  return { subscribe, unsubscribe };
}
