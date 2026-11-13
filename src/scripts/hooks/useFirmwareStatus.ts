import { useEffect, useState } from 'react';
import { useConfigContext } from '@/config';
import { useRosContext } from '@/scripts/context/RosContext';
import type { GetFirmwareStatusResponse } from '@/types/rosInterfaces';
import useRosService from './useRosService';

export interface FirmwareStatusHook {
  status: GetFirmwareStatusResponse | null;
  error: string | null;
  robot: string;
}

export default function useFirmwareStatus(): FirmwareStatusHook {
  const { settings } = useConfigContext();
  const { ros } = useRosContext();
  const robot = `${settings.ros.hostname}:${settings.ros.port}`;
  const { callService, isInitialized } = useRosService<
    { refresh: boolean },
    GetFirmwareStatusResponse
  >(
    '/raph_system/get_firmware_status',
    'raph_interfaces/srv/GetFirmwareStatus',
  );
  const [result, setResult] = useState<{
    robot: string;
    connection: typeof ros;
    status: GetFirmwareStatusResponse | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!isInitialized || !ros) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const check = async (refresh: boolean) => {
      let delay = 30_000;
      let nextRefresh = true;
      try {
        const status = await callService({ refresh });
        if (
          ![
            'up_to_date',
            'update_available',
            'running_newer',
            'incomparable',
            'unavailable',
          ].includes(status.status) ||
          typeof status.checking !== 'boolean' ||
          typeof status.current_version !== 'string' ||
          typeof status.target_version !== 'string' ||
          !Number.isSafeInteger(status.checked_at) ||
          status.checked_at < 0 ||
          typeof status.status_message !== 'string' ||
          typeof status.update_command !== 'string' ||
          typeof status.update_instructions !== 'string' ||
          (status.status === 'update_available' &&
            (!status.current_version ||
              !status.target_version ||
              !status.update_command ||
              !status.update_instructions))
        ) {
          throw new Error('Invalid firmware status response.');
        }
        if (cancelled) return;
        setResult({ robot, connection: ros, status, error: null });
        if (status.checking) {
          delay = 2_000;
          nextRefresh = false;
        } else if (status.status !== 'unavailable') {
          delay = 15 * 60_000;
        }
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        console.warn('[useFirmwareStatus] Failed to check firmware:', message);
        setResult({ robot, connection: ros, status: null, error: message });
      }
      if (!cancelled) {
        timer = setTimeout(() => void check(nextRefresh), delay);
      }
    };

    timer = setTimeout(() => void check(true), 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [callService, isInitialized, robot, ros]);

  const isCurrent =
    ros !== null && result?.robot === robot && result.connection === ros;
  return {
    status: isCurrent ? result.status : null,
    error: isCurrent ? result.error : null,
    robot,
  };
}
