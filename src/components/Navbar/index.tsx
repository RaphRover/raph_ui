import Frame from '@components/ui/Frame';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Navbar,
  Offcanvas,
  Row,
  Stack,
} from 'react-bootstrap';
import Dummy from '@root/public/favicon/favicon.svg';

export default function RaphNavbar() {
  return (
    <Navbar className="bg-body" expand="false" sticky="top">
      <Container fluid>
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
        <Navbar.Toggle // TEMP icon with rover steering mode
          className="ms-auto"
        />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Stack direction="vertical" gap={2} style={{ justifySelf: 'left' }}>
          <Frame>
            ROS Status:
            <img
              src={Dummy}
              alt="ROS Status"
              style={{
                marginLeft: '0.5rem',
                width: '21px',
                marginBottom: '0.2rem',
              }}
            />
          </Frame>
          <Frame>
            <div>Battery 1: 100%</div>
            <div>Battery 2: 100%</div>
          </Frame>
          <Frame>
            <div>IMU readings: Roll: 180.00</div>
            <div>Pitch: 180.00 | Yaw: 180.00</div>
          </Frame>
        </Stack>
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
              <Button variant="outline-success">Toggle driving</Button>
              <Button variant="outline-info">Toggle steering mode</Button>
              <Dropdown drop="start">
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                  Camera Streams
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Camera 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Camera 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Camera 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-secondary">Settings</Button>

              <Row className="mt-auto">
                <Col>
                  <Button variant="outline-secondary">
                    Toggle virtual joystick
                  </Button>
                </Col>
                <Col>
                  <Button variant="outline-secondary">
                    Toggle keyboard control
                  </Button>
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
