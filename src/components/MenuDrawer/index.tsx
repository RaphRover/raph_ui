import StreamDropdown from '@components/StreamDropdown';
import { useAppContext } from '@scripts/context/AppContext';
import {
  Button,
  Col,
  Offcanvas,
  Row,
  Stack,
  ToggleButton,
} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

export default function MenuDrawer() {
  const {
    isKeyboardControlEnabled,
    isVirtualGamepadEnabled,
    setKeyboardControlEnabled,
    setVirtualGamepadEnabled,
    wheelCalibration,
  } = useAppContext();
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const { robotVelocityControl, isMenuVisible, setMenuVisible } =
    useAppContext();
  const { isDrivingEnabled, setDrivingEnabled } = robotVelocityControl;

  const { isInitialized, isLoading, calibrateWheels } = wheelCalibration;

  const handleClose = () => setMenuVisible(false);

  return (
    <Offcanvas
      show={isMenuVisible}
      placement="end"
      onHide={handleClose}
      aria-labelledby="offcanvasMenuLabel"
      scrollable={'true'}
    >
      <Offcanvas.Header closeButton>Menu</Offcanvas.Header>
      <Offcanvas.Body>
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
            onClick={calibrateWheels}
          >
            Calibrate wheels
          </Button>
          <StreamDropdown desktopLayout={isDesktop} />
          <Button variant="outline-secondary">Settings</Button>

          <Row className="mt-auto">
            <Col>
              <ToggleButton
                id="toggle-virtual-gamepad"
                type="checkbox"
                checked={isVirtualGamepadEnabled}
                value={''}
                onClick={() => setVirtualGamepadEnabled((prev) => !prev)}
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
      </Offcanvas.Body>
    </Offcanvas>
  );
}
