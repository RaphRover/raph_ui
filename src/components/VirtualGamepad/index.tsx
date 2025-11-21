import { useAppContext } from '@scripts/context/AppContext';
import { Joystick } from 'react-joystick-component';
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
import styles from './styles.module.css';
import { VIRTUAL_JOYSTICK_CONFIG } from '@scripts/config/config';
import { useMediaQuery } from 'react-responsive';

export default function VirtualGamepad() {
  const {
    robotVelocityControl,
    isVirtualGamepadEnabled,
    steeringMode,
    wheelCalibration,
  } = useAppContext();
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
  const {
    isLoading: isSwitchingSteeringMode,
    isInitialized: isSteeringModeInitialized,
    toggleSteeringMode,
  } = steeringMode;
  const {
    isLoading: isCalibratingWheels,
    isInitialized: isCalibareWheelsInitialized,
    calibrateWheels,
  } = wheelCalibration;

  const joystickSize = isMobile && isPortrait ? MOBILE_SIZE_PX : SIZE_PX;
  const buttonSize = joystickSize / 2 - 10;
  const baseColor = isDrivingEnabled ? COLOR_BASE : COLOR_BASE_DISABLED;
  const stickColor = isDrivingEnabled ? COLOR_STICK : COLOR_STICK_DISABLED;

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

  if (!isVirtualGamepadEnabled) return null;
  return (
    <>
      <div
        className={styles.virtualButtonsContainer}
        style={{ height: joystickSize }}
      >
        <button
          className={styles.virtualButton}
          disabled={
            !isDrivingEnabled ||
            isCalibratingWheels ||
            !isCalibareWheelsInitialized
          }
          style={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: baseColor,
          }}
          onClick={calibrateWheels}
        >
          X
        </button>
        <button
          className={styles.virtualButton}
          disabled={
            !isDrivingEnabled ||
            isSwitchingSteeringMode ||
            !isSteeringModeInitialized
          }
          style={{
            marginLeft: 'auto',
            width: buttonSize,
            height: buttonSize,
            backgroundColor: baseColor,
          }}
          onClick={toggleSteeringMode}
        >
          B
        </button>
      </div>
      <div className={styles.VirtualJoystickContainer}>
        <Joystick
          disabled={!isDrivingEnabled}
          size={joystickSize}
          stickSize={joystickSize * STICK_SIZE_RATIO}
          baseColor={baseColor}
          stickColor={stickColor}
          throttle={THROTTLE_MS}
          move={handleMove}
          stop={handleStop}
        />
      </div>
    </>
  );
}
