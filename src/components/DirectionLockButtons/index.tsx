import { useAppContext } from '@/scripts/context/AppContext';
import { Button, ButtonGroup } from 'react-bootstrap';
import styles from './styles.module.css';

export default function DirectionLockButtons() {
  const { robotVelocityControl, isVirtualGamepadEnabled } = useAppContext();
  const { isGuidedSteeringEnabled, directionLock, setDirectionLock } =
    robotVelocityControl;

  if (!isGuidedSteeringEnabled || isVirtualGamepadEnabled) return null;

  return (
    <div className={styles.container}>
      <ButtonGroup vertical>
        <Button
          variant={
            directionLock === 'forward' ? 'fl-primary' : 'outline-fl-primary'
          }
          onClick={() =>
            setDirectionLock((prev) => (prev === 'forward' ? null : 'forward'))
          }
        >
          Forward
        </Button>
        <Button
          variant={directionLock === null ? 'danger' : 'outline-danger'}
          onClick={() => setDirectionLock(null)}
        >
          Stop
        </Button>
        <Button
          variant={
            directionLock === 'backward' ? 'fl-primary' : 'outline-fl-primary'
          }
          onClick={() =>
            setDirectionLock((prev) =>
              prev === 'backward' ? null : 'backward',
            )
          }
        >
          Backward
        </Button>
      </ButtonGroup>
    </div>
  );
}
