import { useEffect, useRef, useState } from 'react';
import * as ROSLIB from 'roslib';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';

export default function useRos(
  hostname: string,
  port: number = 9090,
  reconnectInterval = 5000,
): ROSLIB.Ros | null {
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);

  const url = `ws://${hostname}:${port}`;
  const toastId = 'ros';
  const isInitialDisconnect = useRef(false);

  useEffect(() => {
    console.debug('[useROS] Setting up ROS connection effect');
    const rosInstance = new ROSLIB.Ros({ url });

    const connectToROS = () => {
      rosInstance.connect(url);

      console.log('[useROS] Connecting to ROS at:', url);
      showOrUpdateToast('Connecting to ROS...', {
        isLoading: true,
        toastId,
      });
    };

    // ROS events

    const connectionListener = () => {
      console.info('[useROS] Connected to ROS');
      showOrUpdateToast('Connection to ROS established', {
        type: 'success',
        isLoading: false,
        toastId,
      });
      isInitialDisconnect.current = true;
      setRos(rosInstance);
    };

    const errorListener = () => {
      console.error('Error encountered while connecting to ROS');
      showOrUpdateToast('Error encountered while connecting to ROS', {
        type: 'error',
        isLoading: false,
        toastId,
      });
      setRos(null);
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
      setRos(null);
      setTimeout(() => connectToROS(), reconnectInterval);
    };

    rosInstance.on('connection', connectionListener);
    rosInstance.on('error', errorListener);
    rosInstance.on('close', disconnectListener);

    connectToROS();

    return () => {
      console.debug('[useROS] Cleaning up ROS connection effect');
      rosInstance.close();
      rosInstance.off('connection', connectionListener);
      rosInstance.off('error', errorListener);
      rosInstance.off('close', disconnectListener);
      setRos(null);
    };
  }, [reconnectInterval, url]);

  return ros;
}
