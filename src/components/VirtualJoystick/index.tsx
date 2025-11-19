import { useAppContext } from '@scripts/context/AppContext';
import { Joystick } from 'react-joystick-component';
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
import styles from './styles.module.css';
import { VIRTUAL_JOYSTICK_CONFIG } from '@scripts/config/config';
import { useMediaQuery } from 'react-responsive';

export default function VirtualJoystick() {
  const { robotVelocityControl, isVirtualJoystickEnabled } = useAppContext();
  const { isDrivingEnabled, setRobotVelocity } = robotVelocityControl;
  const {
    SIZE_PX,
    MOBILE_SIZE_PX,
    STICK_SIZE_RATIO,
    COLOR_BASE,
    COLOR_STICK,
    COLOR_BASE_DISABLED,
    COLOR_STICK_DISABLED,
    THROTTLE_MS,
  } = VIRTUAL_JOYSTICK_CONFIG;

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isMobile = useMediaQuery({ maxWidth: 767 });


  const handleMove = (event: IJoystickUpdateEvent) => {
    if (!isDrivingEnabled) {
      setRobotVelocity({
        speed: 0,
        steering_angle: 0,
      });
      return;
    }
    const { x, y } = event;
    setRobotVelocity({
      speed: y ?? 0,
      steering_angle: (x ?? 0) * -1,
    });
  };

  const handleStop = () => {
    setRobotVelocity({
      speed: 0,
      steering_angle: 0,
    });
  };

  if (!isVirtualJoystickEnabled) return null;
  return (
    <div className={styles.virtualJoystickContainer}>
      <Joystick
        disabled={!isDrivingEnabled}
        size={isMobile && isPortrait ? MOBILE_SIZE_PX : SIZE_PX}
        stickSize={(isMobile && isPortrait ? MOBILE_SIZE_PX : SIZE_PX) * STICK_SIZE_RATIO}
        baseColor={isDrivingEnabled ? COLOR_BASE : COLOR_BASE_DISABLED}
        stickColor={isDrivingEnabled ? COLOR_STICK : COLOR_STICK_DISABLED}
        throttle={THROTTLE_MS}
        move={handleMove}
        stop={handleStop}
      />
    </div>
  );
}
