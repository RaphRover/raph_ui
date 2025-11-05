import useRosService from '@scripts/hooks/useRosService';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  SteeringModes,
  type ServiceResponse,
  type SteeringModeRequest,
} from '@root/src/types/rosInterfaces';

import AckermannIcon from './ackermann.svg?react';
import TurnInPlaceIcon from './turn-in-place.svg?react';
import styles from './styles.module.css';
import { toast } from 'react-toastify';

export default function SteeringModeSwitch() {
  const [steeringMode, setSteeringMode] = useState<SteeringModeRequest | null>(
    null,
  );
  const { callService, isLoading } = useRosService<
    SteeringModeRequest,
    ServiceResponse
  >('controller/set_steering_mode', 'raph_interfaces/srv/SetSteeringMode');

  const toggleSteeringMode = async () => {
    const newSteeringMode =
      steeringMode === SteeringModes.ACKERMANN
        ? SteeringModes.TURN_IN_PLACE
        : SteeringModes.ACKERMANN;
    try {
      const promise = callService(newSteeringMode);
      toast.promise(
        promise,
        {
          success: `Steering mode set to: ${newSteeringMode === SteeringModes.ACKERMANN ? 'Ackermann' : 'Turn in place'}`,
          error: 'Failed to change steering mode',
          pending: 'Changing steering mode...',
        },
        { toastId: 'steering-mode-switch' },
      );
      const response = await promise;
      if (response.success) setSteeringMode(newSteeringMode);
    } catch (error) {
      console.error(
        '[SteeringModeSwitch] Failed to change steering mode:',
        error,
      );
    }
  };

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
