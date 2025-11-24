import { useAppContext } from '@scripts/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import { DRIVE_CONFIG, GAMEPAD_CONFIG } from '@scripts/config/config';
import type { AckermannDriveMsg } from 'types/rosInterfaces';
import { showOrUpdateToast } from '@scripts/utils/showOrUpdateToast';

export default function RobotController() {
  const [isGamepadConnected, setGamepadConnected] = useState(false);
  const prevGamepadRef = useRef<Gamepad | null>(null);

  const {
    isKeyboardControlEnabled,
    robotVelocityControl,
    wheelCalibration,
    steeringMode,
  } = useAppContext();
  const { setRobotVelocity } = robotVelocityControl;
  const { calibrateWheels } = wheelCalibration;
  const { toggleSteeringMode } = steeringMode;
  const keyboardControlToastId = 'keyboardControlToast';
  const gamepadToastId = 'gamepadConnectionToast';

  // Reset velocity on window focus loss
  useEffect(() => {
    const handleBlur = () => {
      console.debug('[RobotController] Window focus lost - stopping robot');
      setRobotVelocity({ speed: 0, steering_angle: 0 });
    };

    window.addEventListener('blur', handleBlur);
    console.debug('[RobotController] Added window blur handler');

    return () => {
      window.removeEventListener('blur', handleBlur);
      console.debug('[RobotController] Removed window blur handler');
    };
  }, [setRobotVelocity]);

  // Keyboard control
  useEffect(() => {
    if (!isKeyboardControlEnabled) {
      console.debug('[RobotController] Keyboard control disabled');
      showOrUpdateToast('Keyboard control disabled', {
        type: 'info',
        toastId: keyboardControlToastId,
      });
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const repeat = event.repeat;
      if (repeat) return; // Ignore repeated events
      const velocityObject: Partial<AckermannDriveMsg> = {};
      switch (key) {
        case 'w':
          velocityObject.speed = 1;
          break;
        case 's':
          velocityObject.speed = -1;
          break;
        case 'a':
          velocityObject.steering_angle = 1;
          break;
        case 'd':
          velocityObject.steering_angle = -1;
          break;
        default:
          break;
      }
      setRobotVelocity(velocityObject);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const velocityObject: Partial<AckermannDriveMsg> = {};
      switch (key) {
        case 'w':
          velocityObject.speed = 0;
          break;
        case 's':
          velocityObject.speed = 0;
          break;
        case 'a':
          velocityObject.steering_angle = 0;
          break;
        case 'd':
          velocityObject.steering_angle = 0;
          break;
        default:
          break;
      }
      setRobotVelocity(velocityObject);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    console.debug('[RobotController] Keyboard control enabled');
    showOrUpdateToast('Keyboard control enabled', {
      type: 'info',
      toastId: keyboardControlToastId,
    });
    return () => {
      console.debug('[RobotController] Clean keyboard control listeners');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isKeyboardControlEnabled, setRobotVelocity]);

  // Gamepad connection handlers
  useEffect(() => {
    const connectHandler = (event: GamepadEvent) => {
      if (event.gamepad.index !== 0) {
        console.warn(
          '[RobotController] Multiple gamepads detected:',
          event.gamepad,
        );
        showOrUpdateToast(
          <span>
            Multiple gamepads detected. <br /> UI only supports one gamepad.
          </span>,
          {
            type: 'warning',
            toastId: gamepadToastId,
          },
        );
        return;
      }

      setGamepadConnected(true);
      console.info('[RobotController] Gamepad connected:', event.gamepad);
      showOrUpdateToast('Gamepad connected', {
        type: 'info',
        toastId: gamepadToastId,
      });
    };

    const disconnectHandler = (event: GamepadEvent) => {
      const gamepad = event.gamepad;
      if (gamepad.index !== 0) {
        console.info(
          '[RobotController] Disconnected non-primary gamepad:',
          gamepad,
        );
        showOrUpdateToast(<span>Additional gamepad disconnected.</span>, {
          type: 'info',
          toastId: gamepadToastId,
        });
        return;
      }
      setGamepadConnected(false);
      console.info('[RobotController] Gamepad disconnected', gamepad);
      showOrUpdateToast('Gamepad disconnected', {
        type: 'info',
        toastId: gamepadToastId,
      });
    };
    window.addEventListener('gamepadconnected', connectHandler);
    window.addEventListener('gamepaddisconnected', disconnectHandler);
    console.debug('[RobotController] Added gamepad event handlers');
    return () => {
      window.removeEventListener('gamepadconnected', connectHandler);
      window.removeEventListener('gamepaddisconnected', disconnectHandler);
      console.debug('[RobotController] Removed gamepad control event handlers');
    };
  }, []);

  // Gamepad control handlers
  useEffect(() => {
    if (!isGamepadConnected) return;

    const handleGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      const prevGamepad = prevGamepadRef.current;
      if (gamepad === null) return;

      const {
        LINEAR_VELOCITY_LIMIT_MPS: maxVelocity,
        STEERING_ANGLE_LIMIT_RAD: maxSteeringAngle,
      } = DRIVE_CONFIG;

      const {
        JOYSTICK_DEADZONE: threshold,
        CALIBRATION_BUTTON_INDEX,
        STEERING_MODE_BUTTON_INDEX,
        DRIVING_DEADMAN_BUTTON_INDEX,
        FORWARD_AXIS_INDEX,
        STEERING_AXIS_INDEX,
      } = GAMEPAD_CONFIG;

      const steeringModeButton =
        gamepad.buttons[STEERING_MODE_BUTTON_INDEX].pressed;
      const prevSteeringModeButton =
        prevGamepad?.buttons[STEERING_MODE_BUTTON_INDEX].pressed;
      if (steeringModeButton && !prevSteeringModeButton) {
        // Steering mode button pressed
        console.info('[RobotController] Toggle steering mode button pressed');
        toggleSteeringMode();
      }

      const calibrationButton =
        gamepad.buttons[CALIBRATION_BUTTON_INDEX].pressed;
      const prevCalibrationButton =
        prevGamepad?.buttons[CALIBRATION_BUTTON_INDEX].pressed;
      if (calibrationButton && !prevCalibrationButton) {
        // Calibration button pressed
        console.info('[RobotController] Calibrate wheels button pressed');
        calibrateWheels();
      }

      const leftStickY = gamepad.axes[FORWARD_AXIS_INDEX];
      const rightStickX = gamepad.axes[STEERING_AXIS_INDEX];
      const drivingDeadmanPressed =
        gamepad.buttons[DRIVING_DEADMAN_BUTTON_INDEX].pressed;

      const velocityObject: Partial<AckermannDriveMsg> = {
        speed: 0,
        steering_angle: 0,
      };
      if (drivingDeadmanPressed) {
        velocityObject.speed =
          Math.abs(leftStickY) > threshold ? -leftStickY * maxVelocity : 0;
        velocityObject.steering_angle =
          Math.abs(rightStickX) > threshold
            ? -rightStickX * maxSteeringAngle
            : 0;
      }
      setRobotVelocity(velocityObject);
      prevGamepadRef.current = gamepad;
    };

    let animationFrame: number | undefined;
    let lastUpdate = 0;
    const handleGamepadLoop = (timestamp: number) => {
      if (timestamp - lastUpdate >= DRIVE_CONFIG.GAMEPAD_INTERVAL_MS) {
        handleGamepad();
        lastUpdate = timestamp;
      }
      animationFrame = requestAnimationFrame(handleGamepadLoop);
    };
    animationFrame = requestAnimationFrame(handleGamepadLoop);
    console.debug('[RobotController] Gamepad controller mounted');

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      console.debug('[RobotController] Gamepad controller unmounted');
    };
  }, [
    calibrateWheels,
    isGamepadConnected,
    setRobotVelocity,
    toggleSteeringMode,
  ]);

  return null;
}
