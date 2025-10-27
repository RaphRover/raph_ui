import { useCallback, useRef, useState } from 'react';
import { Ros, Topic } from 'roslib';

type RosMessage = Record<string, unknown>;

export type TopicManager = {
  topicData: { [key: string]: unknown };
  subscribe: (
    topicName: string,
    messageType: string,
    updateInterval?: number,
  ) => void;
  unsubscribe: (topicName: string) => void;
};

export default function useRosTopicManager(ros: Ros | null): TopicManager {
  const [topicData, setTopicData] = useState<{ [key: string]: unknown }>({});
  const consumerCounts = useRef<{ [key: string]: number }>({});
  const subscriptions = useRef<{ [key: string]: Topic<RosMessage> }>({});

  const subscribe = useCallback(
    (topicName: string, messageType: string, updateInterval: number = 100) => {
      if (!ros) return;

      const currentCount = consumerCounts.current[topicName] || 0;
      consumerCounts.current[topicName] = currentCount + 1;

      if (currentCount > 0) {
        console.debug(
          `[useRosTopicManager] Added consumer for topic: ${topicName}, total consumers: ${
            consumerCounts.current[topicName]
          }`,
        );
        return;
      }

      const topic = new Topic<RosMessage>({
        ros,
        name: topicName,
        messageType,
        throttle_rate: updateInterval,
      });

      topic.subscribe((message: RosMessage) => {
        setTopicData((prevData) => ({
          ...prevData,
          [topicName]: message,
        }));
      });

      subscriptions.current[topicName] = topic;
      console.debug(
        `[useRosTopicManager] Subscribed to ROS topic: ${topicName}, total consumers: ${
          consumerCounts.current[topicName]
        }`,
      );
    },
    [ros],
  );

  const unsubscribe = useCallback(
    (topicName: string) => {
      if (!ros) return;

      const currentCount = consumerCounts.current[topicName] || 0;
      if (currentCount <= 0) return;

      consumerCounts.current[topicName] = currentCount - 1;

      if (consumerCounts.current[topicName] > 0) {
        console.debug(
          `[useRosTopicManager] Removed consumer for topic: ${topicName}, remaining consumers: ${
            consumerCounts.current[topicName]
          }`,
        );
        return;
      }

      const topic = subscriptions.current[topicName];
      if (!topic) {
        console.warn(
          `[useRosTopicManager] No active subscription found for topic: ${topicName}`,
        );
        return;
      }

      topic.unsubscribe();
      delete subscriptions.current[topicName];
      delete consumerCounts.current[topicName];
      console.debug(
        `[useRosTopicManager] Unsubscribed from ROS topic: ${topicName}`,
      );
    },
    [ros],
  );

  return { topicData, subscribe, unsubscribe };
}
