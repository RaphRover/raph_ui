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
import ImuReadings from '@/components/ImuReadings';
import { toast } from 'react-toastify';
import useRosService from '@/scripts/hooks/useRosService';
import useRosTopicPublisher from '@/scripts/hooks/useRosTopicPublisher';
import {
  LED_STRIP_SIZE,
  type LedStripStateMsg,
  type GetControllerInfoResponse,
  type GetOsVersionResponse,
} from '@/types/rosInterfaces';
import { useEffect, useState } from 'react';

const LED_PANEL_LIGHT_PRIORITY = 120;
const LED_PANEL_LIGHT_COLOR = {
  red: 255,
  green: 255,
  blue: 255,
  white: 255,
};

const buildLedStripState = (priority: number): LedStripStateMsg => ({
  state: Array.from({ length: LED_STRIP_SIZE }, () => ({
    duration: 0,
    priority,
    color:
      priority === -1
        ? { red: 0, green: 0, blue: 0, white: 0 }
        : LED_PANEL_LIGHT_COLOR,
  })),
});

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
  const isTablet = useMediaQuery({ minWidth: 760 });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [firmwareVersion, setFirmwareVersion] = useState('Unknown');
  const [bootloaderVersion, setBootloaderVersion] = useState('Unknown');
  const [raphOsVersion, setRaphOsVersion] = useState('Unknown');
  const [isLedPanelsLit, setIsLedPanelsLit] = useState(false);

  const {
    callService: callGetControllerInfo,
    isInitialized: isControllerInfoInitialized,
  } = useRosService<undefined, GetControllerInfoResponse>(
    '/controller/get_controller_info',
    'raph_interfaces/srv/GetControllerInfo',
  );
  const {
    callService: callGetOsVersion,
    isInitialized: isOsVersionInitialized,
  } = useRosService<undefined, GetOsVersionResponse>(
    '/raph_system/get_os_version',
    'raph_interfaces/srv/GetOsVersion',
  );
  const publishLedStripState = useRosTopicPublisher<LedStripStateMsg>(
    'controller/cmd_led_strip',
    'raph_interfaces/msg/LedStripState',
  );

  const { isDrivingEnabled, setDrivingEnabled } = robotVelocityControl;

  const { isInitialized, isLoading, calibrateWheels, isCalibrated } =
    wheelCalibration;

  const handleDrivingToggle = () => {
    setDrivingEnabled((prev) => {
      const isEnablingDriving = !prev;
      if (isEnablingDriving && !isCalibrated) {
        toast.warn(
          'Wheels are not calibrated. Steering commands will be ignored.',
          {
            toastId: 'driving-uncalibrated-warning',
          },
        );
      }
      return !prev;
    });
  };

  const handleLedPanelsToggle = () => {
    setIsLedPanelsLit((prev) => {
      const nextIsLit = !prev;
      publishLedStripState(
        nextIsLit
          ? buildLedStripState(LED_PANEL_LIGHT_PRIORITY)
          : buildLedStripState(-1),
      );
      return nextIsLit;
    });
  };

  const handleClose = () => setMenuVisible(false);

  useEffect(() => {
    if (!isMenuVisible) {
      return;
    }

    if (isControllerInfoInitialized) {
      void callGetControllerInfo()
        .then((response) => {
          setFirmwareVersion(response.firmware_version || 'Unknown');
          setBootloaderVersion(response.bootloader_version || 'Unknown');
        })
        .catch((error: Error) => {
          console.warn(
            '[MenuDrawer] Failed to fetch controller info:',
            error.message,
          );
        });
    }

    if (isOsVersionInitialized) {
      void callGetOsVersion()
        .then((response) => {
          const version = response.version || 'Unknown';
          setRaphOsVersion(
            response.variant ? `${version} (${response.variant})` : version,
          );
        })
        .catch((error: Error) => {
          console.warn(
            '[MenuDrawer] Failed to fetch OS version:',
            error.message,
          );
        });
    }
  }, [
    isMenuVisible,
    isControllerInfoInitialized,
    isOsVersionInitialized,
    callGetControllerInfo,
    callGetOsVersion,
  ]);

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
          {!isTablet && !isPortrait && <ImuReadings />}
          <ToggleButton
            id="enable-driving"
            type="checkbox"
            checked={isDrivingEnabled}
            value={''}
            onClick={handleDrivingToggle}
            variant="outline-fl-primary"
          >
            {isDrivingEnabled ? 'Disable Driving' : 'Enable Driving'}
          </ToggleButton>
          <ToggleButton
            id="toggle-led-panels"
            type="checkbox"
            checked={isLedPanelsLit}
            value={''}
            onClick={handleLedPanelsToggle}
            variant="outline-fl-primary"
          >
            {isLedPanelsLit ? 'Disable LED lights' : 'Enable LED lights'}
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
          <div className={styles.versionInfo}>
            <div className={styles.versionRow}>
              <span>Firmware version</span>
              <span>{firmwareVersion}</span>
            </div>
            <div className={styles.versionRow}>
              <span>Bootloader version</span>
              <span>{bootloaderVersion}</span>
            </div>
            <div className={styles.versionRow}>
              <span>RaphOS version</span>
              <span>{raphOsVersion}</span>
            </div>
          </div>
          <CopyrightFrame />
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
