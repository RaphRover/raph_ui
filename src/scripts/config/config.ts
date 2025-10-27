export const config = {
  rosHostname: import.meta.env.VITE_ROBOT_HOSTNAME || location.hostname,
  intervals: {
    // in milliseconds
    rosReconnect: 5000,
    rosTopicsPoll: 5000,
  },
};
