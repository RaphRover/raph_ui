import StreamDropdown from '@/components/StreamDropdown';
import { useAppContext } from '@/scripts/context/AppContext';
import useFullscreen from '@/scripts/hooks/useFullscreen';
import {
  Button,
  Col,
  Offcanvas,
  Row,
  Stack,
  ToggleButton,
} from 'react-bootstrap';
import CopyrightFrame from '@/components/CopyrightFrame';

import { useMediaQuery } from 'react-responsive';
import ServiceOptions from '@/components/ServiceOptions';
import styles from './styles.module.css';

export default function MenuDrawer() {
  const {
    isKeyboardControlEnabled,
    isVirtualGamepadEnabled,
    setKeyboardControlEnabled,
    setVirtualGamepadEnabled,
    wheelCalibration,
    setConfigVisible,
    robotVelocityControl,
    isMenuVisible,
    setMenuVisible,
  } = useAppContext();
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const { isFullscreen, toggleFullscreen } = useFullscreen();

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
      className={styles.offcanvas}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className={styles.body}>
        <Stack gap={2} style={{ height: '100%' }}>
          <ToggleButton
            id="enable-driving"
            type="checkbox"
            checked={isDrivingEnabled}
            value={''}
            onClick={() => setDrivingEnabled((prev) => !prev)}
            variant="outline-fl-primary"
          >
            {isDrivingEnabled ? 'Disable Driving' : 'Enable Driving'}
          </ToggleButton>
          <Button
            id="calibrate-wheels"
            variant="fl-secondary"
            disabled={!isInitialized || isLoading}
            onClick={calibrateWheels}
          >
            Calibrate wheels
          </Button>
          <StreamDropdown desktopLayout={isDesktop} />
          <Button
            onClick={() => {
              setConfigVisible(true);
              setMenuVisible(false);
            }}
            variant="fl-secondary"
          >
            Settings
          </Button>
          <ToggleButton
            className="mt-auto"
            id="toggle-fullscreen"
            type="checkbox"
            checked={isFullscreen}
            value={''}
            onClick={toggleFullscreen}
            variant="fl-secondary"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </ToggleButton>
          <Row>
            <Col>
              <ToggleButton
                id="toggle-virtual-gamepad"
                type="checkbox"
                checked={isVirtualGamepadEnabled}
                value={''}
                onClick={() => setVirtualGamepadEnabled((prev) => !prev)}
                variant="fl-secondary"
              >
                {isVirtualGamepadEnabled ? 'Hide' : 'Show'} Virtual Gamepad
              </ToggleButton>
            </Col>
            <Col>
              <ToggleButton
                id="toggle-keyboard-control"
                type="checkbox"
                checked={isKeyboardControlEnabled}
                value={''}
                onClick={() => setKeyboardControlEnabled((prev) => !prev)}
                variant="fl-secondary"
              >
                {isKeyboardControlEnabled ? 'Disable' : 'Enable'} Keyboard
                Control
              </ToggleButton>
            </Col>
          </Row>
          <ServiceOptions desktopLayout={isDesktop} />
          <CopyrightFrame />
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
