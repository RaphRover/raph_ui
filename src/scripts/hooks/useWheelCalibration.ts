import { useState } from 'react';
import useRosService from './useRosService';
import type { ServiceResponse } from 'types/rosInterfaces';

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
    try {
      const response = await callService();
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
