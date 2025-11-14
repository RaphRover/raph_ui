import { Button } from 'react-bootstrap';
import { SteeringModes } from '@root/src/types/rosInterfaces';

import AckermannIcon from './ackermann.svg?react';
import TurnInPlaceIcon from './turn-in-place.svg?react';
import styles from './styles.module.css';
import { useAppContext } from '@scripts/context/AppContext';

export default function SteeringModeSwitch() {
  const { steeringMode, toggleSteeringMode, isLoading } =
    useAppContext().steeringMode;

  const buttonIcon = () => {
    if (steeringMode === SteeringModes.ACKERMANN) return <AckermannIcon />;
    if (steeringMode === SteeringModes.TURN_IN_PLACE)
      return <TurnInPlaceIcon />;
    else return <>Unknown</>;
  };

  return (
    <Button
      variant="outline-secondary"
      className={styles.button}
      disabled={steeringMode === null || isLoading}
      onClick={toggleSteeringMode}
    >
      {buttonIcon()}
    </Button>
  );
}
