import { useMemo } from 'react';
import type { RosTopic } from './useRosTopicList';
import { NAME_MAPPINGS } from '@scripts/config/streamMapping';
import { useConfigContext } from '@scripts/context/ConfigContext';

export interface StreamTopic extends RosTopic {
  displayName: string;
  url: string;
}

export default function useRosStreamList(topicList: RosTopic[]): StreamTopic[] {
  const { rosConfig } = useConfigContext();
  const { HOSTNAME } = rosConfig;

  const streamList = useMemo(() => {
    const list: StreamTopic[] = [];

    topicList.forEach((topic) => {
      if (!topic.type.includes('CompressedImage')) return;
      const topicName = topic.name.replace('/compressed', '');
      const url =
        'http://' +
        HOSTNAME +
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
      list.push(streamTopic);
    });

    return list;
  }, [HOSTNAME, topicList]);

  return streamList;
}
