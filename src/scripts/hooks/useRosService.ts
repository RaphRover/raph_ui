import { useROSContext } from '@scripts/context/ROSContext';
import { useCallback, useEffect, useRef } from 'react';
import { Service } from 'roslib';

export default function useRosService<TRequest, TResponse>(
  serviceName: string,
  serviceType: string,
  timeout: number = 5000,
) {
  const { ros } = useROSContext();
  const serviceRef = useRef<Service<TRequest, TResponse> | null>(null);

  // Service initialization & clean up
  useEffect(() => {
    if (!ros) {
      console.debug(`[useRosService] Service ${serviceName} uninitialized`);
      serviceRef.current = null;
      return;
    }

    const service = new Service<TRequest, TResponse>({
      ros,
      name: serviceName,
      serviceType,
    });
    serviceRef.current = service;
    console.debug(`[useRosService] Service ${serviceName} initialized`);

    return () => {
      console.debug(`[useRosService] Service ${serviceName} uninitialized`);
      serviceRef.current = null;
    };
  }, [ros, serviceName, serviceType]);

  const callService = useCallback(
    (request: TRequest): Promise<TResponse> => {
      if (!serviceRef.current) {
        return Promise.reject(new Error('Service not initialized.'));
      }

      const service = serviceRef.current;

      const serviceCallPromise = new Promise<TResponse>((resolve, reject) => {
        service.callService(
          request,
          (response: TResponse) => {
            resolve(response);
          },
          (error: string) => {
            reject(new Error(error));
          },
        );
      });

      const timeoutPromise = new Promise<TResponse>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              `Service call to ${serviceName} timed out after ${timeout}ms.`,
            ),
          );
        }, timeout);
      });

      return Promise.race([serviceCallPromise, timeoutPromise]);
    },
    [serviceName, timeout],
  );

  return { callService };
}
