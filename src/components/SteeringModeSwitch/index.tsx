import { Button, ButtonGroup } from 'react-bootstrap';
import { SteeringModes } from '@/types/rosInterfaces';

import AckermannIcon from './ackermann.svg?react';
import TurnInPlaceIcon from './turn-in-place.svg?react';
import styles from './styles.module.css';
import { useAppContext } from '@/scripts/context/AppContext';

export default function SteeringModeSwitch() {
  const { steeringMode, toggleSteeringMode, isLoading } =
    useAppContext().steeringMode;

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
          variant={
            steeringMode === mode.value ? 'primary' : 'outline-secondary'
          }
          className={styles.button}
          disabled={isLoading}
          onClick={() => {
            if (steeringMode !== mode.value) {
              toggleSteeringMode();
            }
          }}
        >
          <div>{mode.icon}</div>
          <div className={styles.text}>{mode.name}</div>
        </Button>
      ))}
    </ButtonGroup>
  );
}
