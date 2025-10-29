import useRosService from '@scripts/hooks/useRosService';
import useRosTopicPublisher from '@scripts/hooks/useRosTopicPublisher';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import type { TwistMsg } from 'types/rosInterfaces';

export default function RobotController() {
  const cmdVel = useRef<TwistMsg>({
    linear: { x: 0, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: 0 },
  });
  const publish = useRosTopicPublisher<TwistMsg>(
    'control_manager/cmd_vel',
    'geometry_msgs/Twist',
  );

  // useEffect(() => {
  //   const publishVel = () => {
  //     console.log( 'sending cmd vel' )
  //     publish(cmdVel.current);
  //   };

  //   const lol = setInterval(publishVel, 1000);

  //   return () => {
  //     clearInterval(lol);
  //   };
  // }, [publish]);

  type req = null;
  type response = {
    version: string;
    variant: string;
    major: number;
    minor: number;
    patch: number;
  };

  const lol = useRosService<req, response>(
    '/raph_system/get_os_version',
    'raph_interfaces/srv/GetOsVersion',
  );

  const call = async () => {
    try {
      const promise = lol.callService(null);
      toast.promise(
        promise,
        {
          pending: {
            render({ data }) {
              return 'LOADING! ' + data;
            },
          },
          success: {
            render({ data }) {
              return 'URAAAA! ' + data;
            },
          },
          error: {
            render({ data }) {
              return 'REJECTED! ' + data;
            },
          },
        },
        {
          toastId: 'dupa',
        },
      );
      const elo = await promise;
      console.log(elo);
    } catch (error) {
      console.log(error);
    }
  };

  //call();

  return null;
}
