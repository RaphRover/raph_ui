import { Container, Navbar } from 'react-bootstrap';

export default function RaphNavbar() {
  return (
    <Navbar className="bg-body">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="Raph Rover Logo"
            src="/favicon/favicon.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Raph Rover
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
