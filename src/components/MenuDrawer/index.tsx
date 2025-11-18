import StreamDropdown from '@components/StreamDropdown';
import { useAppContext } from '@scripts/context/AppContext';
import { Button, Col, Row, Stack, ToggleButton } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';

export default function MenuDrawer() {
  const {
    isKeyboardControlEnabled,
    isVirtualJoystickEnabled,
    setKeyboardControlEnabled,
    setVirtualJoystickEnabled,
    wheelCalibration,
  } = useAppContext();
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const { isDrivingEnabled, setDrivingEnabled } =
    useAppContext().robotVelocityControl;

  const { isInitialized, isLoading, calibrateWheels } = wheelCalibration;

  const calibrateWheelsWithToasts = async () => {
    const promise = calibrateWheels();
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
  };

  return (
    <Stack gap={2} style={{ height: '100%' }}>
      <Button variant="outline-secondary">Toggle Fullscreen</Button>
      <ToggleButton
        id="enable-driving"
        type="checkbox"
        checked={isDrivingEnabled}
        value={''}
        onClick={() => setDrivingEnabled((prev) => !prev)}
        variant="outline-success"
      >
        Toggle driving
      </ToggleButton>
      <Button variant="outline-info">Toggle steering mode</Button>
      <Button
        id="calibrate-wheels"
        variant="outline-primary"
        disabled={!isInitialized || isLoading}
        onClick={calibrateWheelsWithToasts}
      >
        Calibrate wheels
      </Button>
      <StreamDropdown desktopLayout={isDesktop} />
      <Button variant="outline-secondary">Settings</Button>

      <Row className="mt-auto">
        <Col>
          <ToggleButton
            id="toggle-keyboard-control"
            type="checkbox"
            checked={isVirtualJoystickEnabled}
            value={''}
            onClick={() => setVirtualJoystickEnabled((prev) => !prev)}
            variant="outline-secondary"
          >
            Toggle virtual joystick
          </ToggleButton>
        </Col>
        <Col>
          <ToggleButton
            id="toggle-keyboard-control"
            type="checkbox"
            checked={isKeyboardControlEnabled}
            value={''}
            onClick={() => setKeyboardControlEnabled((prev) => !prev)}
            variant="outline-secondary"
          >
            Toggle keyboard control
          </ToggleButton>
        </Col>
      </Row>
      <Button variant="outline-warning">Service menu</Button>
    </Stack>
  );
}
