import { useAppContext } from '@/scripts/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';
import { useConfigContext } from '@/config';

type KeyboardCommandKey = 'w' | 'a' | 's' | 'd';

const keyboardCommandKeys: KeyboardCommandKey[] = ['w', 'a', 's', 'd'];

function isKeyboardCommandKey(key: string): key is KeyboardCommandKey {
  return keyboardCommandKeys.includes(key as KeyboardCommandKey);
}

export default function RobotController() {
  const { settings } = useConfigContext();
  const { linearVelocityMps, steeringAngleLimitRad, angularVelocityRadps } =
    settings.driveConfig;
  const { gamepad } = settings;

  const [isGamepadConnected, setGamepadConnected] = useState(false);
  const prevButtonStatesRef = useRef<boolean[]>([]);
  const keyboardStateRef = useRef<Record<KeyboardCommandKey, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const {
    isKeyboardControlEnabled,
    robotVelocityControl,
    wheelCalibration,
    steeringMode,
  } = useAppContext();
  const { setRobotVelocity, getLatestVelocity } = robotVelocityControl;
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
      setRobotVelocity({ speed: 0, steering_angle: 0, angular_velocity: 0 });
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

    const updateKeyboardVelocity = () => {
      const state = keyboardStateRef.current;
      const velocity = { ...getLatestVelocity() };
      const forward = (state.w ? 1 : 0) - (state.s ? 1 : 0);
      const steering = (state.a ? 1 : 0) - (state.d ? 1 : 0);

      if (state.w || state.s) {
        velocity.speed = forward * linearVelocityMps;
      } else {
        velocity.speed = 0;
      }

      if (state.a || state.d) {
        velocity.steering_angle = steering * steeringAngleLimitRad;
        velocity.angular_velocity = -steering * angularVelocityRadps;
      } else {
        velocity.steering_angle = 0;
        velocity.angular_velocity = 0;
      }

      setRobotVelocity(velocity);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (!isKeyboardCommandKey(key)) return;
      if (keyboardStateRef.current[key]) return;
      keyboardStateRef.current[key] = true;
      updateKeyboardVelocity();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!isKeyboardCommandKey(key)) return;
      if (!keyboardStateRef.current[key]) return;
      keyboardStateRef.current[key] = false;
      updateKeyboardVelocity();
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
  }, [
    angularVelocityRadps,
    getLatestVelocity,
    isKeyboardControlEnabled,
    linearVelocityMps,
    setRobotVelocity,
    steeringAngleLimitRad,
  ]);

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
      ackermannSteeringAxisIndex,
      turnInPlaceSteeringAxisIndex,
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
      const rightStickX = gamepad.axes[ackermannSteeringAxisIndex];
      const leftStickX = gamepad.axes[turnInPlaceSteeringAxisIndex];
      const drivingDeadmanPressed =
        gamepad.buttons[drivingDeadmanButtonIndex].pressed;

      let speed = 0;
      let steering_angle = 0;
      let angular_velocity = 0;
      if (drivingDeadmanPressed) {
        speed =
          Math.abs(leftStickY) > joystickDeadzone
            ? -leftStickY * linearVelocityMps
            : 0;
        steering_angle =
          Math.abs(rightStickX) > joystickDeadzone
            ? -rightStickX * steeringAngleLimitRad
            : 0;
        angular_velocity =
          Math.abs(leftStickX) > joystickDeadzone
            ? leftStickX * angularVelocityRadps
            : 0;
      }
      setRobotVelocity({ speed, steering_angle, angular_velocity });
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
    angularVelocityRadps,
    steeringAngleLimitRad,
  ]);

  return null;
}
