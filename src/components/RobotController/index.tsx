import { useAppContext } from '@/scripts/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import type { AckermannDriveMsg } from '@/types/rosInterfaces';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';
import { useConfigContext } from '@/config';

export default function RobotController() {
  const { settings } = useConfigContext();
  const { linearVelocityMps, steeringAngleLimitRad } = settings.driveConfig;
  const { gamepad } = settings;

  const [isGamepadConnected, setGamepadConnected] = useState(false);
  const prevButtonStatesRef = useRef<boolean[]>([]);

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
  const calibrateWheelsRef = useRef(calibrateWheels);
  const toggleSteeringModeRef = useRef(toggleSteeringMode);

  useEffect(() => {
    calibrateWheelsRef.current = calibrateWheels;
  }, [calibrateWheels]);

  useEffect(() => {
    toggleSteeringModeRef.current = toggleSteeringMode;
  }, [toggleSteeringMode]);

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

    const {
      joystickDeadzone,
      calibrationButtonIndex,
      steeringModeButtonIndex,
      drivingDeadmanButtonIndex,
      forwardAxisIndex,
      steeringAxisIndex,
      gamepadIntervalMs,
    } = gamepad;

    const handleGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      if (!gamepad) return;

      const prevButtons = prevButtonStatesRef.current;
      const steeringModeButton =
        gamepad.buttons[steeringModeButtonIndex].pressed;
      const prevSteeringModeButton =
        prevButtons[steeringModeButtonIndex] ?? false;
      if (steeringModeButton && !prevSteeringModeButton) {
        // Steering mode button pressed
        console.info('[RobotController] Toggle steering mode button pressed');
        toggleSteeringModeRef.current();
      }

      const calibrationButton = gamepad.buttons[calibrationButtonIndex].pressed;
      const prevCalibrationButton =
        prevButtons[calibrationButtonIndex] ?? false;
      if (calibrationButton && !prevCalibrationButton) {
        // Calibration button pressed
        console.info('[RobotController] Calibrate wheels button pressed');
        calibrateWheelsRef.current();
      }

      const leftStickY = gamepad.axes[forwardAxisIndex];
      const rightStickX = gamepad.axes[steeringAxisIndex];
      const drivingDeadmanPressed =
        gamepad.buttons[drivingDeadmanButtonIndex].pressed;

      const velocityObject: Partial<AckermannDriveMsg> = {
        speed: 0,
        steering_angle: 0,
      };
      if (drivingDeadmanPressed) {
        velocityObject.speed =
          Math.abs(leftStickY) > joystickDeadzone
            ? -leftStickY * linearVelocityMps
            : 0;
        velocityObject.steering_angle =
          Math.abs(rightStickX) > joystickDeadzone
            ? -rightStickX * steeringAngleLimitRad
            : 0;
      }
      setRobotVelocity(velocityObject);
      prevButtons[steeringModeButtonIndex] = steeringModeButton;
      prevButtons[calibrationButtonIndex] = calibrationButton;
    };

    let animationFrame: number | undefined;
    let lastUpdate = 0;
    const handleGamepadLoop = (timestamp: number) => {
      if (timestamp - lastUpdate >= gamepadIntervalMs) {
        handleGamepad();
        lastUpdate = timestamp;
      }
      animationFrame = requestAnimationFrame(handleGamepadLoop);
    };
    animationFrame = requestAnimationFrame(handleGamepadLoop);
    console.debug('[RobotController] Gamepad controller mounted');

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      prevButtonStatesRef.current = [];
      console.debug('[RobotController] Gamepad controller unmounted');
    };
  }, [
    gamepad,
    isGamepadConnected,
    linearVelocityMps,
    setRobotVelocity,
    steeringAngleLimitRad,
  ]);

  return null;
}
