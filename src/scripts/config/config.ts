export interface RosConfig {
  /** Robot hostname that UI will connect to (from .env or location.hostname) */
  HOSTNAME: string;
  /** WebSocket port for ROS connection */
  PORT: number;
  /** Interval (ms) between reconnection attempts */
  RECONNECT_INTERVAL_MS: number;
  /** Interval for polling ROS topics (ms) */
  TOPIC_POLL_INTERVAL_MS: number;
  /** Precision of setting float ROS parameters */
  PARAM_FLOAT_PRECISION: number;
}

/**
 * Configuration for ROS connection.
 * @type {RosConfig}
 */
export const DEFAULT_ROS_CONFIG: RosConfig = {
  HOSTNAME: import.meta.env.VITE_ROBOT_HOSTNAME || location.hostname,
  PORT: 9090,
  RECONNECT_INTERVAL_MS: 5000,
  TOPIC_POLL_INTERVAL_MS: 5000,
  PARAM_FLOAT_PRECISION: 4,
};

/**
 * Default stream name used on first load of the UI.
 * @type {string}
 */
export const DEFAULT_INITIAL_STREAM_NAME = '/oak/rgb/image_raw/compressed';

export interface BatteryConfig {
  /** Battery status refresh interval in milliseconds */
  REFRESH_INTERVAL_MS: number;
  /** Decimal precision for battery percentage display */
  DISPLAY_PRECISION: number;
  /** Upper battery percentage considered critical */
  CRITICAL_LEVEL_PERCENT: number;
  /** Upper battery percentage considered warning */
  WARNING_LEVEL_PERCENT: number;
}

/**
 * Configuration for battery status display.
 * @type {BatteryConfig}
 */
export const DEFAULT_BATTERY_CONFIG: BatteryConfig = {
  REFRESH_INTERVAL_MS: 1000,
  DISPLAY_PRECISION: 2,
  CRITICAL_LEVEL_PERCENT: 20,
  WARNING_LEVEL_PERCENT: 60,
};

export interface ImuConfig {
  /** IMU status refresh interval in milliseconds */
  REFRESH_INTERVAL_MS: number;
  /** Decimal precision for IMU data display */
  DISPLAY_PRECISION: number;
}

/**
 * Configuration for IMU status display.
 * @type {ImuConfig}
 */
export const DEFAULT_IMU_CONFIG: ImuConfig = {
  REFRESH_INTERVAL_MS: 1000,
  DISPLAY_PRECISION: 2,
};

/**
 * Defines range constraints for adjustable numeric values.
 */
export interface RangeConfig {
  /** Default value */
  DEFAULT: number;
  /** Minimum allowed value */
  MIN: number;
  /** Maximum allowed value */
  MAX: number;
  /** Step increment for adjustments */
  STEP: number;
}

export interface DriveConfig {
  /** Ackermann velocity publish interval in milliseconds */
  VELOCITY_PUBLISH_INTERVAL_MS: number;
  /** Configuration for robot linear velocity in meters per second */
  LINEAR_VELOCITY_MPS: RangeConfig;
  /** Configuration for robot steering angle velocity in radians per second */
  STEERING_ANGLE_VELOCITY_RADPS: RangeConfig;
  /** Robot physical steering angle limit in radians */
  STEERING_ANGLE_LIMIT_RAD: number;
  /** Configuration for acceleration in AckermannMsg (m/s^2) */
  ACKERMANN_ACCELERATION: RangeConfig;
  /** Configuration for jerk in AckermannMsg (m/s^3) */
  ACKERMANN_JERK: RangeConfig;
}

/**
 * Configuration for robot drive system.
 * @type {DriveConfig}
 */
export const DEFAULT_DRIVE_CONFIG: DriveConfig = {
  VELOCITY_PUBLISH_INTERVAL_MS: 100,
  LINEAR_VELOCITY_MPS: {
    DEFAULT: 1.0,
    MIN: 0.1,
    MAX: 2.0,
    STEP: 0.1,
  },
  STEERING_ANGLE_VELOCITY_RADPS: {
    DEFAULT: 3.0,
    MIN: 0.1,
    MAX: 5.0,
    STEP: 0.1,
  },
  STEERING_ANGLE_LIMIT_RAD: 1.1,
  ACKERMANN_ACCELERATION: {
    DEFAULT: 1.0,
    MIN: 0.0,
    MAX: 3.0,
    STEP: 0.1,
  },
  ACKERMANN_JERK: {
    DEFAULT: 2.0,
    MIN: 0.0,
    MAX: 5.0,
    STEP: 0.1,
  },
};

/**
 * Configuration for gamepad buttons.
 * For reference, see: https://www.w3.org/TR/gamepad/#remapping
 */
export interface GamepadConfig {
  /** Index of the button used to calibrate wheels */
  CALIBRATION_BUTTON_INDEX: number;
  /** Index of the button used to toggle steering mode */
  STEERING_MODE_BUTTON_INDEX: number;
  /** Index of the button used as driving deadman switch */
  DRIVING_DEADMAN_BUTTON_INDEX: number;
  /** Index of the axis used for forward/backward control */
  FORWARD_AXIS_INDEX: number;
  /** Index of the axis used for steering control */
  STEERING_AXIS_INDEX: number;
  /** Joystick deadzone threshold (0.0 - 1.0) */
  JOYSTICK_DEADZONE: number;
  /** Gamepad fetch interval in milliseconds */
  GAMEPAD_INTERVAL_MS: number;
}

/**
 * Configuration for gamepad control.
 * @type {GamepadConfig}
 */
export const DEFAULT_GAMEPAD_CONFIG: GamepadConfig = {
  CALIBRATION_BUTTON_INDEX: 2,
  STEERING_MODE_BUTTON_INDEX: 1,
  DRIVING_DEADMAN_BUTTON_INDEX: 5,
  FORWARD_AXIS_INDEX: 1,
  STEERING_AXIS_INDEX: 2,
  JOYSTICK_DEADZONE: 0.1,
  GAMEPAD_INTERVAL_MS: 50,
};

export interface VirtualGamepadConfig {
  /** Joystick size in pixels */
  SIZE_PX: number;
  /** Joystick size in pixels for mobile devices */
  MOBILE_SIZE_PX: number;
  /** Joystick stick size ratio relative to base size (0.0 - 1.0) */
  STICK_SIZE_RATIO: number;
  /** Joystick base color */
  COLOR_BASE: string;
  /** Joystick stick color */
  COLOR_STICK: string;
  /** Joystick base color when disabled */
  COLOR_BASE_DISABLED: string;
  /** Joystick stick color when disabled */
  COLOR_STICK_DISABLED: string;
  /** Joystick throttle in ms */
  THROTTLE_MS: number;
}

export const DEFAULT_VIRTUAL_GAMEPAD_CONFIG: VirtualGamepadConfig = {
  SIZE_PX: 250,
  MOBILE_SIZE_PX: 150,
  STICK_SIZE_RATIO: 0.5,
  COLOR_BASE: 'rgba(255,255,255, 0.3)',
  COLOR_STICK: 'rgba(255,255,255, 0.5)',
  COLOR_BASE_DISABLED: 'rgba(255,255,255, 0.1)',
  COLOR_STICK_DISABLED: 'rgba(255,255,255, 0.2)',
  THROTTLE_MS: 50,
};

export interface ToastConfig {
  /** Default duration for auto-closing toasts in milliseconds */
  AUTO_CLOSE_MS: number;
}

export const DEFAULT_TOAST_CONFIG: ToastConfig = {
  AUTO_CLOSE_MS: 3000,
};
