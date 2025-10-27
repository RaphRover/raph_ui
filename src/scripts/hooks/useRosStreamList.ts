import { useEffect, useState } from 'react';
import { ROS_CONFIG } from '@scripts/config/config';
import type { RosTopic } from './useRosTopicList';
import { NAME_MAPPINGS } from '@scripts/config/streamMapping';

export interface StreamTopic extends RosTopic {
  displayName: string;
  url: string;
}

export default function useRosStreamList(topicList: RosTopic[]): StreamTopic[] {
  const [streamList, SetStreamList] = useState<StreamTopic[]>([]);
  const IP = ROS_CONFIG.IP;

  useEffect(() => {
    const localStreamList: StreamTopic[] = [];

    // Empty topic list idicates no ROS connection
    // We should clear stream list when there is no ROS connection
    if (topicList.length === 0) {
      SetStreamList([]);
      return;
    }

    topicList.forEach((topic) => {
      if (!topic.type.includes('CompressedImage')) return;
      const topicName = topic.name.replace('/compressed', '');
      const url =
        'http://' +
        IP +
        ':8080/stream?topic=' +
        topicName +
        '&type=ros_compressed';
      const mapping = NAME_MAPPINGS.find(
        (mapping) => mapping.topicName === topic.name,
      ) ?? {
        topicName: topic.name,
        displayName: topic.name,
      };
      const streamTopic: StreamTopic = {
        ...topic,
        url,
        ...mapping,
      };
      localStreamList.push(streamTopic);
    });
    SetStreamList(localStreamList);
    return () => {
      SetStreamList([]);
    };
  }, [IP, topicList]);

  return streamList;
}
