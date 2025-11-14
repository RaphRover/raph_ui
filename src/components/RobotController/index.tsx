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
  });

  // Gamepad control handlers
  useEffect(() => {
    if (!isGamepadConnected) return;

    const handleGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      if (gamepad === null) return;

      const {
        JOYSTICK_DEADZONE: threshold,
        LINEAR_VELOCITY_LIMIT_MPS: maxVelocity,
        STEERING_ANGLE_LIMIT_RAD: maxSteeringAngle,
      } = DRIVE_CONFIG;

      const leftStickY = gamepad.axes[1];
      const rightStickX = gamepad.axes[2];
      const drivingDeadmanPressed = gamepad.buttons[5].pressed;

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
