import { useEffect, useEffectEvent, useState } from 'react';
import {
  SteeringModes,
  type ServiceResponse,
  type SteeringModeRequest,
} from '@root/src/types/rosInterfaces';
import useRosService from './useRosService';
import { toast } from 'react-toastify';

export type SteeringModeHook = {
  steeringMode: SteeringMode | null;
  toggleSteeringMode: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
};

type SteeringMode = (typeof SteeringModes)[keyof typeof SteeringModes];

export default function useSteeringMode(): SteeringModeHook {
  const [steeringMode, setSteeringMode] = useState<SteeringMode | null>(null);
  const { callService, isLoading, isInitialized } = useRosService<
    SteeringModeRequest,
    ServiceResponse
  >('controller/set_steering_mode', 'raph_interfaces/srv/SetSteeringMode');

  const toggleSteeringMode = async () => {
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
          error: { render({ data }: { data: Error }) {
              return `Failed to change steering mode: ${data.message}`;
            } },
          pending: 'Changing steering mode...',
        },
        { toastId: 'steering-mode-switch' },
      );
      const response = await promise;
      if (response.success) setSteeringMode(newSteeringMode);
    } catch (error) {
      console.error(
        '[SteeringModeSwitch] Failed to change steering mode:',
        error,
      );
    }
  };

  // We don't want steeringMode to trigger the effect, so we use useEffectEvent
  const steeringModeEvent = useEffectEvent(() => steeringMode);

  // Initialize steering mode on first load
  useEffect(() => {
    if (steeringModeEvent() !== null || !isInitialized) return;
    console.debug(
      '[SteeringModeSwitch] Setting initial steering mode to Ackermann',
    );
    const promise = callService({
      steering_mode: { data: SteeringModes.ACKERMANN },
    });
    toast.promise(
      promise,
      {
        success: 'Steering mode set to: Ackermann',
        error: 'Failed to set initial steering mode',
        pending: 'Setting initial steering mode...',
      },
      { toastId: 'steering-mode-initial' },
    );
    promise
      .then((response) => {
        if (response.success) setSteeringMode(SteeringModes.ACKERMANN);
      })
      .catch((error) => {
        console.error(
          '[SteeringModeSwitch] Failed to set initial steering mode:',
          error,
        );
      });

    return () => {
      promise.catch(() => {}); // Prevent unhandled promise rejection on unmount
      setSteeringMode(null);
    };
  }, [callService, isInitialized]);

  return { steeringMode, toggleSteeringMode, isLoading, isInitialized };
}
