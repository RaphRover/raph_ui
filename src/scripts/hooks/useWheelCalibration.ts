import { useState } from 'react';
import useRosService from './useRosService';
import type { ServiceResponse } from '@/types/rosInterfaces';
import { toast } from 'react-toastify';

export interface WheelCalibration {
  isCalibrated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  calibrateWheels: () => Promise<ServiceResponse>;
}

export default function useWheelCalibration(): WheelCalibration {
  // Temporary true as there is no way of getting wheel calibration status yet
  const [isCalibrated, setIsCalibrated] = useState<boolean>(true);
  const { callService, isInitialized, isLoading } = useRosService<
    undefined,
    ServiceResponse
  >('controller/calibrate_servos', 'std_srvs/srv/Trigger');

  const calibrateWheels = async () => {
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
      if (response.success) {
        setIsCalibrated(true);
      }
      return response;
    } catch (error) {
      console.error('[useWheelCalibration] Failed to calibrate wheels:', error);
      throw error;
    }
  };

  return {
    isCalibrated,
    isInitialized,
    isLoading,
    calibrateWheels,
  };
}
