export interface StreamNameMapping {
  topicName: string;
  displayName: string;
}

export const NAME_MAPPINGS: StreamNameMapping[] = [
  {
    topicName: "/oak/left/image_raw/compressed",
    displayName: 'OAK-D Left Stereo camera'
  },
  {
    topicName: "/oak/right/image_raw/compressed",
    displayName: 'OAK-D Right Stereo camera'
  },
  {
    topicName: "/oak/rgb/image_raw/compressed",
    displayName: 'OAK-D RGB camera'
  },
];
