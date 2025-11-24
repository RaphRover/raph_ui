import type { ServiceResponse } from 'types/rosInterfaces';
import useRosService, { type RosServiceHook } from './useRosService';
import { toast } from 'react-toastify';

export type SystemServices = {
  reboot: RosServiceHook<undefined, ServiceResponse>;
  shutdown: RosServiceHook<undefined, ServiceResponse>;
};

export default function useSystemServices(): SystemServices {
  const rebootService = useRosService<undefined, ServiceResponse>(
    'raph_system/reboot',
    'std_srvs/srv/Trigger',
  );
  const shutdownService = useRosService<undefined, ServiceResponse>(
    'raph_system/shutdown',
    'std_srvs/srv/Trigger',
  );

  const callRebootServiceWithToast = () => {
    const promise = rebootService.callService();
    toast.promise(
      promise,
      {
        pending: 'Rebooting system...',
        success: 'System rebooted successfully!',
        error: {
            render({ data }: { data: Error }) {
              return `Failed to reboot system: ${data.message}`;
            },
          },
      },
      {
        toastId: 'reboot-service-toast',
      },
    );
    return promise;
  };

  const callShutdownServiceWithToast = () => {
    const promise = shutdownService.callService();
    toast.promise(
      promise,
      {
        pending: 'Shutting down system...',
        success: 'System shut down successfully!',
        error: 'Failed to shut down system.',
      },
      {
        toastId: 'shutdown-service-toast',
      },
    );
    return promise;
  };

  return {
    reboot: { ...rebootService, callService: callRebootServiceWithToast },
    shutdown: { ...shutdownService, callService: callShutdownServiceWithToast },
  };
}
