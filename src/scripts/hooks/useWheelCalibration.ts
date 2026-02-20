import { useCallback } from 'react';
import useRosService from './useRosService';
import type {
  DrivetrainStateMsg,
  ServiceResponse,
} from '@/types/rosInterfaces';
import { toast } from 'react-toastify';
import useRosTopicSubscription from './useRosTopicSubscription';

export interface WheelCalibration {
  isCalibrated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  calibrateWheels: () => Promise<ServiceResponse>;
}

export default function useWheelCalibration(): WheelCalibration {
  const drivetrainState = useRosTopicSubscription<DrivetrainStateMsg>(
    'controller/drivetrain_state',
    'raph_interfaces/msg/DrivetrainState',
  );
  const { callService, isInitialized, isLoading } = useRosService<
    undefined,
    ServiceResponse
  >('controller/calibrate_servos', 'std_srvs/srv/Trigger');
  const isCalibrated = drivetrainState?.is_servos_calibrated ?? false;

  const calibrateWheels = useCallback(async () => {
    const promise = callService();
    toast.promise(
      promise,
      {
        pending: 'Calibrating wheels...',
        success: 'Wheels calibrated successfully!',
        error: {
          render({ data }: { data: Error }) {
            return `Failed to calibrate wheels: ${data.message}`;
          },
        },
      },
      {
        toastId: 'calibrate-wheels',
      },
    );
    try {
      const response = await promise;
      return response;
    } catch (error) {
      console.error('[useWheelCalibration] Failed to calibrate wheels:', error);
      throw error;
    }
  }, [callService]);

  return {
    isCalibrated,
    isInitialized,
    isLoading,
    calibrateWheels,
  };
}
