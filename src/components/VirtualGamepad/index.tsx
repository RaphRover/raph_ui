import { useAppContext } from '@/scripts/context/AppContext';
import { Joystick } from 'react-joystick-component';
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
import styles from './styles.module.css';
import { useMediaQuery } from 'react-responsive';
import { useConfigContext } from '@/config';

export default function VirtualGamepad() {
  const {
    robotVelocityControl,
    isVirtualGamepadEnabled,
    steeringMode,
    wheelCalibration,
  } = useAppContext();
  const { isDrivingEnabled, setRobotVelocity } = robotVelocityControl;
  const { settings } = useConfigContext();
  const { driveConfig, virtualGamepad } = settings;

  const {
    sizePx,
    mobileSizePx,
    stickSizeRatio,
    colorBase,
    colorStick,
    colorBaseDisabled,
    colorStickDisabled,
    throttleMs,
  } = virtualGamepad;
  const { linearVelocityMps, steeringAngleLimitRad, angularVelocityRadps } =
    driveConfig;

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const {
    isLoading: isSwitchingSteeringMode,
    isInitialized: isSteeringModeInitialized,
    toggleSteeringMode,
  } = steeringMode;
  const {
    isLoading: isCalibratingWheels,
    isInitialized: isCalibrateWheelsInitialized,
    calibrateWheels,
  } = wheelCalibration;

  const joystickSize = isMobile ? mobileSizePx : sizePx;
  const buttonSize = joystickSize / 2 - 10;
  const baseColor = isDrivingEnabled ? colorBase : colorBaseDisabled;
  const stickColor = isDrivingEnabled ? colorStick : colorStickDisabled;

  const handleMove = (event: IJoystickUpdateEvent) => {
    if (!isDrivingEnabled) {
      setRobotVelocity({ speed: 0, steering_angle: 0, angular_velocity: 0 });
      return;
    }
    const { x, y } = event;
    const steeringInput = (x ?? 0) * -1;
    const speedInput = y ?? 0;
    setRobotVelocity({
      speed: speedInput * linearVelocityMps,
      steering_angle: steeringInput * steeringAngleLimitRad,
      angular_velocity: steeringInput * angularVelocityRadps * -1,
    });
  };

  const handleStop = () => {
    setRobotVelocity({ speed: 0, steering_angle: 0, angular_velocity: 0 });
  };

  if (!isVirtualGamepadEnabled) return null;
  return (
    <>
      <div
        className={styles.virtualButtonsContainer}
        style={{ height: joystickSize, maxWidth: buttonSize * 2 + 20 }}
      >
        <button
          className={styles.virtualButton}
          disabled={
            !isDrivingEnabled ||
            isCalibratingWheels ||
            !isCalibrateWheelsInitialized
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
          stickSize={joystickSize * stickSizeRatio}
          baseColor={baseColor}
          stickColor={stickColor}
          throttle={throttleMs}
          move={handleMove}
          stop={handleStop}
        />
      </div>
    </>
  );
}
