import { useAppContext } from '@scripts/context/AppContext';
import { useEffect, useState } from 'react';
import { DRIVE_CONFIG } from '@scripts/config/config';
import type { AckermannDriveMsg } from 'types/rosInterfaces';
import { showOrUpdateToast } from '@scripts/utils/showOrUpdateToast';

export default function RobotController() {
  const [isGamepadConnected, setGamepadConnected] = useState(false);

  const { isKeyboardControlEnabled, robotVelocityControl } = useAppContext();
  const { setRobotVelocity } = robotVelocityControl;
  const keyboardControlToastId = 'keyboardControlToast';
  const gamepadToastId = 'gamepadConnectionToast';

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
    const connectHandler = () => {
      setGamepadConnected(true);
      console.info(
        '[RobotController] Gamepad connected',
        navigator.getGamepads(),
      );
      showOrUpdateToast('Gamepad connected', {
        type: 'info',
        toastId: gamepadToastId,
      });
    };

    const disconnectHandler = () => {
      setGamepadConnected(false);
      console.info(
        '[RobotController] Gamepad disconnected',
        navigator.getGamepads(),
      );
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
  });

  // Gamepad control handlers
  useEffect(() => {
    if (!isGamepadConnected) return;

    const handleGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads.length > 1) {
        console.warn('[handleGamepad] Multiple gamepads detected!', gamepads);
      }
      const gamepad = gamepads[0];
      if (gamepad === null) return;

      const threshold = DRIVE_CONFIG.JOYSTICK_DEADZONE;

      const leftStickY = gamepad.axes[1];
      const rightStickX = gamepad.axes[2];
      const drivingDeadmanPressed = gamepad.buttons[5].pressed;

      const velocityObject: Partial<AckermannDriveMsg> = {
        speed: 0,
        steering_angle: 0,
      };
      if (drivingDeadmanPressed) {
        velocityObject.speed =
          Math.abs(leftStickY) > threshold ? -leftStickY : 0;
        velocityObject.steering_angle =
          Math.abs(rightStickX) > threshold ? -rightStickX : 0;
      }
      setRobotVelocity(velocityObject);
    };

    let animationFrame: number;
    const interval = setInterval(() => {
      animationFrame = requestAnimationFrame(handleGamepad);
    }, DRIVE_CONFIG.GAMEPAD_INTERVAL_MS);
    console.debug('[RobotController] Gamepad controller mounted');

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrame);
      console.debug('[RobotController] Gamepad controller unmounted');
    };
  }, [isGamepadConnected, setRobotVelocity]);

  return null;
}
