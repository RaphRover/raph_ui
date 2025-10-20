import { useEffect, useMemo, useRef } from 'react';
import * as ROSLIB from 'roslib';
import { showOrUpdateToast } from '@scripts/utils/showOrUpdateToast';

export default function useROS(
  ip: string,
  reconnectInterval = 6000,
): ROSLIB.Ros {
  const url = `ws://${ip}:9090`;
  const toastId = 'ros';
  const ros = useMemo(
    () =>
      new ROSLIB.Ros({
        url,
      }),
    [url],
  );
  const isInitialDisconnect = useRef(false);

  useEffect(() => {
    console.debug('[useROS] Setting up ROS connection effect');
    const connectToROS = () => {
      ros.connect(url);

      console.log('Connecting to ROS at:', url);
      showOrUpdateToast('Connecting to ROS...', {
        isLoading: true,
        toastId,
      });
    };

    // ROS events

    const connectionListener = () => {
      console.info('Connected to ROS');
      showOrUpdateToast('Connection to ROS established', {
        type: 'success',
        isLoading: false,
        toastId,
      });
      isInitialDisconnect.current = true;
    };

    const errorListener = () => {
      console.error('Error encountered while connecting to ROS');
      showOrUpdateToast('Error encountered while connecting to ROS', {
        type: 'error',
        isLoading: false,
        toastId,
      });
    };

    const disconnectListener = () => {
      console.info('Disconnected from ROS');
      if (isInitialDisconnect.current)
        showOrUpdateToast('Disconnected from ROS', {
          type: 'warning',
          isLoading: false,
          toastId,
        });
      isInitialDisconnect.current = false;
      setTimeout(() => connectToROS(), reconnectInterval);
    };

    ros.on('connection', connectionListener);
    ros.on('error', errorListener);
    ros.on('close', disconnectListener);

    connectToROS();

    return () => {
      console.debug('[useROS] Cleaning up ROS connection effect');
      ros.close();
      ros.off('connection', connectionListener);
      ros.off('error', errorListener);
      ros.off('close', disconnectListener);
    };
  }, [reconnectInterval, ros, url]);

  return ros;
}
