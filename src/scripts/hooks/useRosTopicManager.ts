import { useCallback, useRef } from 'react';
import { Ros, Topic } from 'roslib';

export type RosMessage = Record<string, unknown>;
type SubscriptionCallback = (message: RosMessage) => void;

export type TopicManager = {
  subscribe: (
    topicName: string,
    messageType: string,
    callback: SubscriptionCallback,
    updateInterval?: number,
  ) => void;
  unsubscribe: (topicName: string, callback: SubscriptionCallback) => void;
  publish: (
    topicName: string,
    messageType: string,
    message: RosMessage,
  ) => void;
  removePublisher: (topicName: string) => void;
};

export default function useRosTopicManager(ros: Ros | null): TopicManager {
  const topics = useRef<{ [key: string]: Topic<RosMessage> }>({});
  const callbacks = useRef<{ [key: string]: Set<SubscriptionCallback> }>({});

  // Helper function to retrieve or create topic
  const getOrCreateTopic = useCallback(
    (topicName: string, messageType: string) => {
      if (!ros) return null;

      if (!topics.current[topicName]) {
        topics.current[topicName] = new Topic({
          ros,
          name: topicName,
          messageType,
        });
        console.debug(
          `[useRosTopicManager] Created Topic instance for: ${topicName}`,
        );
      }
      return topics.current[topicName];
    },
    [ros],
  );

  const cleanupTopic = useCallback((topicName: string) => {
    const topic = topics.current[topicName];
    if (!topic) {
      console.error(
        '[useRosTopicManager] Tried to cleanup non existing topic',
        topicName,
      );
      return;
    }
    const isSubscribed = (callbacks.current[topicName]?.size ?? 0) > 0;
    const isAdvertised = topic.isAdvertised;

    if (!isSubscribed && !isAdvertised) {
      topics.current[topicName]?.unsubscribe();
      delete topics.current[topicName];
      delete callbacks.current[topicName];
      console.debug(
        `[useRosTopicManager] Deleted Topic instance for: ${topicName}`,
      );
    }
  }, []);

  const subscribe = useCallback(
    (
      topicName: string,
      messageType: string,
      callback: SubscriptionCallback,
      updateInterval: number = 100,
    ) => {
      const topic = getOrCreateTopic(topicName, messageType);
      if (!topic) {
        console.warn('[useRosTopicManager] Unable to get topic', topicName);
        return;
      }

      topic.throttle_rate = updateInterval;

      // First subscription for this topic
      if (
        !callbacks.current[topicName] ||
        callbacks.current[topicName].size === 0
      ) {
        callbacks.current[topicName] = new Set();
        topic.subscribe((message: RosMessage) => {
          callbacks.current[topicName]?.forEach((cb) => cb(message));
        });
        console.debug(
          `[useRosTopicManager] Created ROS subscription for: ${topicName}`,
        );
      }

      callbacks.current[topicName].add(callback);
      console.debug(
        `[useRosTopicManager] Added consumer for topic: ${topicName}`,
      );
    },
    [getOrCreateTopic],
  );

  const unsubscribe = useCallback(
    (topicName: string, callback: SubscriptionCallback) => {
      const callbackSet = callbacks.current[topicName];
      if (!ros || !callbackSet) return;

      callbackSet.delete(callback);
      console.debug(
        `[useRosTopicManager] Removed consumer for topic: ${topicName}`,
      );

      cleanupTopic(topicName);
    },
    [cleanupTopic, ros],
  );

  const publish = useCallback(
    (topicName: string, messageType: string, message: RosMessage) => {
      const topic = getOrCreateTopic(topicName, messageType);
      if (!topic) return;

      topic.publish(message);
    },
    [getOrCreateTopic],
  );

  const removePublisher = useCallback(
    (topicName: string) => {
      const topic = topics.current[topicName];
      if (!topic) return;

      if (topic.isAdvertised) topic.unadvertise();

      cleanupTopic(topicName);
    },
    [cleanupTopic],
  );

  return { subscribe, unsubscribe, publish, removePublisher };
}
