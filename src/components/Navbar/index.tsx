import {
  Button,
  Col,
  Container,
  Navbar,
  Offcanvas,
  Row,
  Stack,
  ToggleButton,
} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import ROSStatus from '@components/ROSStatus';
import BatteryStatus from '@components/BatteryStatus';
import ImuReadings from '@components/ImuReadings';
import StreamDropdown from '@components/StreamDropdown';
import SteeringModeSwitch from '@components/SteeringModeSwitch';
import { useAppContext } from '@scripts/context/AppContext';

export default function RaphNavbar() {
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const {
    isKeyboardControlEnabled,
    isVirtualJoystickEnabled,
    setKeyboardControlEnabled,
    setVirtualJoystickEnabled,
    robotVelocityControl,
  } = useAppContext();
  const { isDrivingEnabled, setDrivingEnabled } = robotVelocityControl;

  const infoPanel = () => {
    return (
      <Stack
        direction={isDesktop ? 'horizontal' : 'vertical'}
        gap={2}
        style={{
          justifySelf: 'left',
          width: !isDesktop ? '100%' : 'auto',
          marginTop: !isDesktop ? '0.5rem' : 0,
          alignItems: 'stretch',
        }}
      >
        <ROSStatus />
        <BatteryStatus />
        <ImuReadings />
      </Stack>
    );
  };

  return (
    <Navbar className="bg-body flex-shrink-0" expand="false" sticky="top">
      <Container fluid className="justify-content-start">
        <Navbar.Brand href="/">
          <img
            alt="Raph Rover Logo"
            src="/favicon/favicon.svg"
            width="40"
            height="40"
            className="d-inline-block align-top"
          />
          <span style={{ paddingLeft: '0.8rem', verticalAlign: 'sub' }}>
            Raph Rover
          </span>
        </Navbar.Brand>
        {isDesktop && infoPanel()}
        <Stack direction="horizontal" gap={2} className="ms-auto">
          <SteeringModeSwitch />
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            style={{ height: '100%' }}
          />
        </Stack>

        {!isDesktop && infoPanel()}
        <Navbar.Offcanvas
          placement="end"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ overflow: 'visible' }}>
            <Stack gap={2} style={{ height: '100%' }}>
              <Button variant="outline-secondary">Toggle Fullscreen</Button>
              <ToggleButton
                id="enable-driving"
                type="checkbox"
                checked={isDrivingEnabled}
                value={""}
                onClick={() => setDrivingEnabled((prev) => !prev)}
                variant="outline-success"
              >
                Toggle driving
              </ToggleButton>
              <Button variant="outline-info">Toggle steering mode</Button>
              <StreamDropdown desktopLayout={isDesktop} />
              <Button variant="outline-secondary">Settings</Button>

              <Row className="mt-auto">
                <Col>
                  <ToggleButton
                    id="toggle-keyboard-control"
                    type="checkbox"
                    checked={isVirtualJoystickEnabled}
                    value={""}
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
                    value={""}
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
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
