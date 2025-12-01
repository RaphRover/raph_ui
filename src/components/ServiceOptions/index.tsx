import { Button, Dropdown, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppContext } from '@/scripts/context/AppContext';
import styles from './styles.module.css';

interface ServiceOptionsProps {
  desktopLayout: boolean;
}

export default function ServiceOptions(props: ServiceOptionsProps) {
  const { systemServices } = useAppContext();
  const { reboot, shutdown } = systemServices;
  const { desktopLayout } = props;

  return (
    <Dropdown drop={desktopLayout ? 'start' : 'up-centered'}>
      <Dropdown.Toggle style={{ width: '100%' }} variant="outline-fl-primary">
        Service Options
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.menu}
      >
        <Stack gap={2}>
          <Button
            variant="fl-secondary"
            onClick={() => {
              toast.dismiss();
            }}
          >
            Dismiss all toasts
          </Button>
          <Button
            variant="warning"
            disabled={reboot.isLoading || !reboot.isInitialized}
            onClick={reboot.callService}
          >
            Reboot computer
          </Button>
          <Button
            variant="danger"
            disabled={shutdown.isLoading || !shutdown.isInitialized}
            onClick={shutdown.callService}
          >
            Power off computer
          </Button>
        </Stack>
      </Dropdown.Menu>
    </Dropdown>
  );
}
