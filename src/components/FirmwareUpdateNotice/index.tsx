import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAppContext } from '@/scripts/context/AppContext';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';

export default function FirmwareUpdateNotice() {
  const {
    firmwareStatus: { status, error, robot },
  } = useAppContext();
  const dismissed = useRef(new Set<string>());
  const reportedFailures = useRef(new Set<string>());
  const toastId = `firmware-update:${robot}`;
  const failureId = `firmware-check:${robot}`;
  const available = status?.status === 'update_available' && !status.checking;
  const failure =
    error ||
    (status?.status === 'unavailable' && !status.checking
      ? status.status_message
      : null);

  useEffect(() => {
    if (failure) {
      const key = `${robot}:${failure}`;
      if (reportedFailures.current.has(key)) return;
      reportedFailures.current.add(key);
      showOrUpdateToast(`Firmware update check unavailable: ${failure}`, {
        type: 'warning',
        toastId: failureId,
      });
    } else if (status && !status.checking) {
      toast.dismiss(failureId);
    }
  }, [failure, failureId, robot, status]);

  useEffect(() => {
    if (!available || !status) {
      if (!status?.checking) toast.dismiss(toastId);
      return;
    }
    const key = `${robot}:${status.target_version}`;
    if (dismissed.current.has(key)) return;
    showOrUpdateToast(
      <div>
        <div>
          New RaphCore firmware version available. See{' '}
          <a
            href="https://docs.fictionlab.pl/raph-rover/guides/firmware-update"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            documentation
          </a>{' '}
          for update instructions.{' '}
        </div>
      </div>,
      {
        type: 'info',
        toastId,
        autoClose: false,
        onClose: (reason) => {
          if (reason === true) dismissed.current.add(key);
        },
      },
    );
  }, [available, robot, status, toastId]);

  useEffect(
    () => () => {
      toast.dismiss(toastId);
      toast.dismiss(failureId);
    },
    [failureId, toastId],
  );

  return null;
}
