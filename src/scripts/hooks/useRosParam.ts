import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import { Param, Ros } from 'roslib';
import { useConfigContext } from '@/config';

export interface RosParam<T> {
  value: T | null;
  get: () => Promise<T>;
  set: (value: T) => Promise<T>;
}

type RosParamType = {
  int: number;
  float: number;
  string: string;
  bool: boolean;
  'int[]': number[];
  'float[]': number[];
  'string[]': string[];
  'bool[]': boolean[];
};

export default function useRosParam<K extends keyof RosParamType>(
  ros: Ros | null,
  paramNode: string,
  paramName: string,
  timeout: number,
  paramType: K,
): RosParam<RosParamType[K]> {
  type valueType = RosParamType[K];
  const { settings } = useConfigContext();
  const { paramFloatPrecision } = settings.ros;

  const [paramValue, setParamValue] = useState<valueType | null>(null);
  const paramRef = useRef<Param | null>(null);
  const isCallingRef = useRef<boolean>(false);
  const pendingGetRef = useRef<Promise<valueType> | null>(null);

  const getParam = useCallback(async (): Promise<valueType> => {
    if (!paramRef.current) {
      return Promise.reject(new Error('Param not initialized.'));
    }

    if (pendingGetRef.current) {
      return pendingGetRef.current;
    }

    if (isCallingRef.current) {
      const errorMessage = `Param call to ${paramName} is already in progress.`;
      console.warn('[useRosParam] ' + errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    isCallingRef.current = true;

    const param = paramRef.current;

    const paramGetPromise = new Promise<valueType>((resolve, reject) => {
      param.get(
        (response: valueType) => {
          setParamValue(response);
          resolve(response);
        },
        (error: string) => {
          reject(new Error(error));
        },
      );
    });

    const requestPromise = (async () => {
      let timer: number | undefined;
      const timeoutPromise = new Promise<valueType>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(`Get call to ${paramName} timed out after ${timeout}ms.`),
          );
        }, timeout);
      });

      try {
        return await Promise.race([paramGetPromise, timeoutPromise]);
      } finally {
        isCallingRef.current = false;
        pendingGetRef.current = null;
        clearTimeout(timer);
      }
    })();

    pendingGetRef.current = requestPromise;
    return requestPromise;
  }, [paramName, timeout]);

  const setRosParam = useCallback(
    async (value: valueType): Promise<valueType> => {
      if (!paramRef.current) {
        return Promise.reject(new Error('Param not initialized.'));
      }

      // Wait for any in-flight read to avoid read/write call collisions.
      if (pendingGetRef.current) {
        try {
          await pendingGetRef.current;
        } catch (error) {
          console.debug('[useRosParam] pending get before set failed', error);
        }
      }

      if (isCallingRef.current) {
        const errorMessage = `Param call to ${paramName} is already in progress.`;
        console.warn('[useRosParam] ' + errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      isCallingRef.current = true;

      const param = paramRef.current;

      let parsedValue: valueType = value;

      switch (paramType) {
        case 'int':
          if (typeof value === 'number') {
            parsedValue = Number(value.toFixed(0)) as valueType;
          }
          break;
        case 'float':
          if (typeof value === 'number') {
            parsedValue = Number(value.toPrecision(paramFloatPrecision)) as valueType;
          }
          break;
      }

      const paramSetPromise = new Promise<valueType>((resolve, reject) => {
        param.set(
          parsedValue,
          (response: valueType) => {
            setParamValue(response);
            resolve(response);
          },
          (error: string) => {
            reject(new Error(error));
          },
        );
      });

      let timer: number | undefined;

      const timeoutPromise = new Promise<valueType>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(`Set call to ${paramName} timed out after ${timeout}ms.`),
          );
        }, timeout);
      });

      try {
        return await Promise.race([paramSetPromise, timeoutPromise]);
      } finally {
        isCallingRef.current = false;
        clearTimeout(timer);
      }
    },

    [paramFloatPrecision, paramName, paramType, timeout],
  );

  // We use useEffectEvent as we don't want to fire useEffect on getParam change
  const getParamEffect = useEffectEvent(getParam);

  useEffect(() => {
    if (!ros) {
      return;
    }
    if (!paramRef.current) {
      paramRef.current = new Param({
        ros: ros,
        name: paramNode + ':' + paramName,
      });
      console.debug(`[useRosParam] ROS param ${paramName} initialized`);
    }
    getParamEffect().catch((err) =>
      console.debug('[useRosParam] getParam failed', err),
    );
    return () => {
      paramRef.current = null;
      pendingGetRef.current = null;
      isCallingRef.current = false;
      setParamValue(null);
      console.debug(`[useRosParam] ROS param ${paramName} uninitialized`);
    };
  }, [paramName, paramNode, ros]);

  // TODO in future - add subscription to /parameter_events topics with param-specific callback

  return { value: paramValue, set: setRosParam, get: getParam };
}
