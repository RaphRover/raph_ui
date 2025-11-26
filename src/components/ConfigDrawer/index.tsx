import { Offcanvas, Tabs, Tab } from 'react-bootstrap';
import { useAppContext } from '@scripts/context/AppContext';

export default function ConfigDrawer() {
  const { isConfigVisible, setConfigVisible } = useAppContext();

  return (
    <Offcanvas
      show={isConfigVisible}
      onHide={() => setConfigVisible(false)}
      placement="end"
      aria-labelledby="offcanvasConfigLabel"
      scrollable={'true'}
      style={{ width: '100%', maxWidth: '500px' }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Configuration</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Tabs
          defaultActiveKey="general"
          id="config-tabs"
          className="mb-3"
          justify
        >
          <Tab eventKey="general" title="General">
            <p>General settings will be available here.</p>
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
