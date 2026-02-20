import { Button, ButtonGroup } from 'react-bootstrap';
import { SteeringModes } from '@/types/rosInterfaces';

import AckermannIcon from './ackermann.svg?react';
import TurnInPlaceIcon from './turn-in-place.svg?react';
import styles from './styles.module.css';
import { useAppContext } from '@/scripts/context/AppContext';
import { toast } from 'react-toastify';

export default function SteeringModeSwitch() {
  const {
    steeringMode: steeringModeContext,
    wheelCalibration: { isCalibrated },
  } = useAppContext();
  const { steeringMode, toggleSteeringMode, isLoading } = steeringModeContext;

  const handleSteeringModeChange = async (nextMode: number) => {
    if (steeringMode === nextMode) {
      return;
    }

    if (!isCalibrated) {
      toast.warn(
        'Wheels are not calibrated. Calibrate wheels before changing steering mode.',
        {
          toastId: 'steering-mode-uncalibrated-warning',
        },
      );
      return;
    }

    await toggleSteeringMode();
  };

  const steeringModesRadio = [
    {
      name: 'Ackermann',
      icon: <AckermannIcon />,
      value: SteeringModes.ACKERMANN,
    },
    {
      name: 'Turn in Place',
      icon: <TurnInPlaceIcon />,
      value: SteeringModes.TURN_IN_PLACE,
    },
  ];

  return (
    <ButtonGroup>
      {steeringModesRadio.map((mode) => (
        <Button
          key={mode.value}
          variant={steeringMode === mode.value ? 'fl-primary' : 'fl-secondary'}
          className={styles.button}
          disabled={isLoading}
          onClick={() => {
            void handleSteeringModeChange(mode.value);
          }}
        >
          <div>{mode.icon}</div>
          <div className={styles.text}>{mode.name}</div>
        </Button>
      ))}
    </ButtonGroup>
  );
}
