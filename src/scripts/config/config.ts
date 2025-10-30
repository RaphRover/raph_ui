interface RosConfig {
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
export const ROS_CONFIG: RosConfig = {
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
export const DEFAULT_STREAM_NAME = '/oak/rgb/image_raw/compressed';

interface BatteryConfig {
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
 */
export const BATTERY_CONFIG: BatteryConfig = {
  REFRESH_INTERVAL_MS: 1000,
  DISPLAY_PRECISION: 2,
  CRITICAL_LEVEL_PERCENT: 20,
  WARNING_LEVEL_PERCENT: 60,
};

interface ImuConfig {
  /** IMU status refresh interval in milliseconds */
  REFRESH_INTERVAL_MS: number;
  /** Decimal precision for IMU data display */
  DISPLAY_PRECISION: number;
}

/**
 * Configuration for IMU status display.
 */
export const IMU_CONFIG: ImuConfig = {
  REFRESH_INTERVAL_MS: 1000,
  DISPLAY_PRECISION: 2,
};
