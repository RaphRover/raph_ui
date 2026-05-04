export interface StreamNameMapping {
  topicName: string;
  displayName: string;
}

export const NAME_MAPPINGS: StreamNameMapping[] = [
  {
    topicName: '/oak/left/image_raw/compressed',
    displayName: 'OAK-D Left Stereo camera',
  },
  {
    topicName: '/oak/left_rect/image_rect/compressed',
    displayName: 'OAK-D Left Stereo camera (rectified)',
  },
  {
    topicName: '/oak/right/image_raw/compressed',
    displayName: 'OAK-D Right Stereo camera',
  },
  {
    topicName: '/oak/right_rect/image_rect/compressed',
    displayName: 'OAK-D Right Stereo camera (rectified)',
  },
  {
    topicName: '/oak/rgb/image_raw/compressed',
    displayName: 'OAK-D RGB camera',
  },
  {
    topicName: '/oak/rgb_rect/image_rect/compressed',
    displayName: 'OAK-D RGB camera (rectified)',
  },
  {
    topicName: '/oak_front/preview/compressed',
    displayName: 'OAK Front Preview',
  },
  {
    topicName: '/oak_rear/preview/compressed',
    displayName: 'OAK Rear Preview',
  },
];
