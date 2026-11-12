import { useEffect, useRef } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppContext } from '@/scripts/context/AppContext';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';

export default function FirmwareUpdateNotice() {
  const {
    firmwareStatus: { status, error, robot },
    isFirmwareUpdateVisible,
    setFirmwareUpdateVisible,
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
          New RaphCore firmware available: {status.current_version} &rarr;{' '}
          {status.target_version}.
        </div>
        <Button
          size="sm"
          variant="fl-secondary"
          className="mt-2"
          onClick={() => setFirmwareUpdateVisible(true)}
        >
          Update firmware
        </Button>
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
  }, [available, robot, setFirmwareUpdateVisible, status, toastId]);

  useEffect(
    () => () => {
      toast.dismiss(toastId);
      toast.dismiss(failureId);
    },
    [failureId, toastId],
  );

  return (
    <Modal
      show={isFirmwareUpdateVisible}
      onHide={() => setFirmwareUpdateVisible(false)}
      centered
      aria-labelledby="firmware-update-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="firmware-update-title">
          Update RaphCore firmware
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {available && status ? (
          <>
            <p>
              Running: <strong>{status.current_version}</strong>
              <br />
              Target from installed raph_fw:{' '}
              <strong>{status.target_version}</strong>
            </p>
            <Alert variant="warning">
              This does not flash from the browser. Follow these steps on the
              robot.
            </Alert>
            <p>{status.update_instructions}</p>
            <pre>
              <code>{status.update_command}</code>
            </pre>
          </>
        ) : (
          <p>
            No confirmed firmware update is currently available. Check the menu
            for status.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="fl-secondary"
          onClick={() => setFirmwareUpdateVisible(false)}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
