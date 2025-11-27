import { useRosContext } from '@/scripts/context/RosContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Service } from 'roslib';
import type { ServiceResponse } from '@/types/rosInterfaces';

export type RosServiceHook<Request, Response extends ServiceResponse> = {
  callService: CallService<Request, Response>;
  isLoading: boolean;
  isInitialized: boolean;
};

type CallService<
  Request,
  Response extends ServiceResponse,
> = Request extends undefined
  ? () => Promise<Response>
  : (request: Request) => Promise<Response>;

/**
 * @param serviceName Service name string
 * @param serviceType Service type string
 * @param timeout Service call timeout, defaults to `5000` ms
 * @returns Promise
 */
export default function useRosService<
  Request,
  Response extends ServiceResponse,
>(
  serviceName: string,
  serviceType: string,
  timeout: number = 5000,
): RosServiceHook<Request, Response> {
  const { ros } = useRosContext();

  const serviceRef = useRef<Service<Request, Response> | null>(null);
  const isCallingRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Service initialization & clean up
  useEffect(() => {
    if (!ros) {
      console.debug(`[useRosService] Service ${serviceName} uninitialized`);
      setIsInitialized(false);
      serviceRef.current = null;
      return;
    }

    const service = new Service<Request, Response>({
      ros,
      name: serviceName,
      serviceType,
    });
    serviceRef.current = service;
    console.debug(`[useRosService] Service ${serviceName} initialized`);
    setIsInitialized(true);

    return () => {
      console.debug(`[useRosService] Service ${serviceName} uninitialized`);
      setIsInitialized(false);
      serviceRef.current = null;
    };
  }, [ros, serviceName, serviceType]);

  const callService = useCallback(
    async (request?: Request) => {
      if (isCallingRef.current) {
        const errorMessage = `Service call to ${serviceName} is already in progress.`;
        console.warn('[useRosService] ' + errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      if (!serviceRef.current) {
        return Promise.reject(new Error('Service not initialized.'));
      }

      isCallingRef.current = true;
      setIsLoading(true);

      const service = serviceRef.current;

      const serviceCallPromise = new Promise<Response>((resolve, reject) => {
        service.callService(
          request ?? ({} as Request),
          (response: Response) => {
            if (response.success === false) {
              reject(
                new Error(
                  response.status_message ||
                    'Unknown error during service call.',
                ),
              );
              return;
            }
            resolve(response);
          },
          (error: string) => {
            reject(new Error(error || 'Unknown error during service call.'));
          },
        );
      });

      let timer: number | undefined;
      const timeoutPromise = new Promise<Response>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `Service call to ${serviceName} timed out after ${timeout}ms.`,
            ),
          );
        }, timeout);
      });

      try {
        return await Promise.race([serviceCallPromise, timeoutPromise]);
      } finally {
        isCallingRef.current = false;
        setIsLoading(false);
        clearTimeout(timer);
      }
    },
    [serviceName, timeout],
  ) as CallService<Request, Response>;

  return { callService, isLoading, isInitialized };
}
