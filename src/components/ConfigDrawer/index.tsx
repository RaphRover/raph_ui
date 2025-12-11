import { Offcanvas, Tabs, Tab } from 'react-bootstrap';
import { useAppContext } from '@/scripts/context/AppContext';
import RobotVelocityConfig from '@/components/RobotVelocityConfig';
import styles from './styles.module.css';

export default function ConfigDrawer() {
  const { isConfigVisible, setConfigVisible } = useAppContext();

  return (
    <Offcanvas
      show={isConfigVisible}
      onHide={() => setConfigVisible(false)}
      placement="end"
      aria-labelledby="offcanvasConfigLabel"
      scrollable={'true'}
      className={styles.offcanvas}
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
            <RobotVelocityConfig />
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
