import { showOrUpdateToast } from '@scripts/utils/showOrUpdateToast';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { Ros } from 'roslib';

export interface RosTopic {
  name: string;
  type: string;
}

interface TopicsFromRos {
  topics: string[];
  types: string[];
}

function areTopicMapsEqual(
  mapA: Map<string, string>,
  mapB: Map<string, string>,
): boolean {
  if (mapA.size !== mapB.size) {
    return false;
  }
  for (const [key, value] of mapA) {
    if (!mapB.has(key) || mapB.get(key) !== value) {
      return false;
    }
  }
  return true;
}

export default function useRosStreams(
  ros: Ros | null,
  refreshInterval: number = 10000,
): RosTopic[] {
  const [topicMap, setTopicMap] = useState<Map<string, string>>(new Map());

  const mapSizeEffect = useEffectEvent(() => topicMap.size);

  useEffect(() => {
    if (!ros) return;

    const fetchTopics = () => {
      const callback = (response: TopicsFromRos) => {
        const newTopicMap = new Map<string, string>();
        response.topics.forEach((topicName, index) => {
          newTopicMap.set(topicName, response.types[index]);
        });
        setTopicMap((currentMap) => {
          if (!areTopicMapsEqual(currentMap, newTopicMap)) {
            return newTopicMap;
          }
          // Return the existing map to prevent a re-render.
          return currentMap;
        });
      };

      const failedCallback = (error?: string) => {
        const errorMessage =
          'Could not fetch the topic list from ROS!\n' +
          (error ?? 'Unknown error');
        console.error(errorMessage);
        showOrUpdateToast(errorMessage, {
          toastId: 'topicList',
          type: 'error',
        });
      };

      ros.getTopics(callback, failedCallback);
    };

    fetchTopics();

    const intervalId = setInterval(fetchTopics, refreshInterval);

    return () => {
      clearInterval(intervalId);
      if (mapSizeEffect() > 0) setTopicMap(new Map());
    };
  }, [refreshInterval, ros]);

  const topicList = useMemo(() => {
    return Array.from(topicMap.entries()).map(([name, type]) => ({
      name,
      type,
    }));
  }, [topicMap]);

  return topicList;
}
