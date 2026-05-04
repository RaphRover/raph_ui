import { useMemo } from 'react';
import type { RosTopic } from './useRosTopicList';
import { NAME_MAPPINGS, useConfigContext } from '@/config';

export interface StreamTopic extends RosTopic {
  topicName: string;
  displayName: string;
  url: string;
}

export default function useRosStreamList(topicList: RosTopic[]): StreamTopic[] {
  const { settings } = useConfigContext();
  const { hostname } = settings.ros;

  const streamList = useMemo(() => {
    const list: StreamTopic[] = [];

    topicList.forEach((topic) => {
      if (
        !topic.type.includes('CompressedImage') ||
        !topic.name.endsWith('/compressed')
      )
        return;
      const topicName = topic.name.replace('/compressed', '');
      const url =
        'http://' +
        hostname +
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
  }, [hostname, topicList]);

  return streamList;
}
