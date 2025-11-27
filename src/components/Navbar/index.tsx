import { Container, Navbar, Stack } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import ROSStatus from '@/components/ROSStatus';
import BatteryStatus from '@/components/BatteryStatus';
import ImuReadings from '@/components/ImuReadings';
import SteeringModeSwitch from '@/components/SteeringModeSwitch';
import { useAppContext } from '@/scripts/context/AppContext';
import MenuDrawer from '@/components/MenuDrawer';

export default function RaphNavbar() {
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const { setMenuVisible } = useAppContext();

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
    <>
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
              onClick={() => setMenuVisible(true)}
            />
          </Stack>

          {!isDesktop && infoPanel()}
        </Container>
      </Navbar>
      <MenuDrawer />
    </>
  );
}
