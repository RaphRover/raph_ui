import { Button, Col, Container, Navbar, Row, Stack } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import ROSStatus from '@/components/ROSStatus';
import BatteryStatus from '@/components/BatteryStatus';
import ImuReadings from '@/components/ImuReadings';
import SteeringModeSwitch from '@/components/SteeringModeSwitch';
import { useAppContext } from '@/scripts/context/AppContext';
import MenuDrawer from '@/components/MenuDrawer';
import styles from './styles.module.css';
import MenuIcon from './menu.svg?react';

export default function RaphNavbar() {
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const isTablet = useMediaQuery({ minWidth: 760 });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const { setMenuVisible, setConfigVisible } = useAppContext();

  return (
    <>
      <Navbar className={styles.navbar} expand="false" sticky="top">
        <Container fluid className="justify-content-start">
          <Stack
            direction="horizontal"
            gap={2}
            style={{ alignItems: 'stretch' }}
          >
            <Navbar.Brand href="/" className="d-flex align-items-center">
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
            {(isDesktop || !isPortrait) && <ROSStatus />}
            {(isDesktop || !isPortrait) && <BatteryStatus />}
            {isTablet && <ImuReadings />}
          </Stack>
          <Stack direction="horizontal" gap={2} className="ms-auto">
            {isDesktop && <SteeringModeSwitch />}
            <Button
              className={styles.menuButton}
              variant="fl-secondary"
              onClick={() => {
                setMenuVisible(true);
                setConfigVisible(false);
              }}
              aria-label="Open menu drawer"
            >
              <MenuIcon />
            </Button>
          </Stack>
          {!isDesktop && isPortrait && (
            <Stack
              gap={2}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                justifyContent: 'space-between',
              }}
            >
              <SteeringModeSwitch />
              <Row>
                <Col>
                  <ROSStatus style={{ height: '100%' }} />
                </Col>
                <Col>
                  <BatteryStatus />
                </Col>
              </Row>
              <ImuReadings />
            </Stack>
          )}
        </Container>
      </Navbar>
      <MenuDrawer />
    </>
  );
}
