import { useMemo } from 'react';
import {
  SteeringModes,
  type DrivetrainStateMsg,
  type ServiceResponse,
  type SteeringMode,
  type SteeringModeRequest,
} from '@/types/rosInterfaces';
import useRosService from './useRosService';
import { toast } from 'react-toastify';
import useRosTopicSubscription from './useRosTopicSubscription';

export type SteeringModeHook = {
  steeringMode: SteeringMode | null;
  toggleSteeringMode: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
};

export default function useSteeringMode(): SteeringModeHook {
  const drivetrainState = useRosTopicSubscription<DrivetrainStateMsg>(
    '/controller/drivetrain_state',
    'raph_interfaces/msg/DrivetrainState',
  );
  const { callService, isLoading, isInitialized } = useRosService<
    SteeringModeRequest,
    ServiceResponse
  >('controller/set_steering_mode', 'raph_interfaces/srv/SetSteeringMode');

  const steeringMode = useMemo<SteeringMode | null>(() => {
    return drivetrainState?.steering_mode?.data ?? null;
  }, [drivetrainState]);

  const toggleSteeringMode = async () => {
    if (steeringMode === null) {
      console.warn(
        '[SteeringModeSwitch] Steering mode unavailable, ignoring toggle',
      );
      return;
    }
    const newSteeringMode =
      steeringMode === SteeringModes.ACKERMANN
        ? SteeringModes.TURN_IN_PLACE
        : SteeringModes.ACKERMANN;
    try {
      const promise = callService({ steering_mode: { data: newSteeringMode } });
      toast.promise(
        promise,
        {
          success: `Steering mode set to: ${newSteeringMode === SteeringModes.ACKERMANN ? 'Ackermann' : 'Turn in place'}`,
          error: {
            render({ data }: { data: Error }) {
              return `Failed to change steering mode: ${data.message}`;
            },
          },
          pending: 'Changing steering mode...',
        },
        { toastId: 'steering-mode-switch' },
      );
      await promise;
    } catch (error) {
      console.error(
        '[SteeringModeSwitch] Failed to change steering mode:',
        error,
      );
    }
  };

  return { steeringMode, toggleSteeringMode, isLoading, isInitialized };
}
