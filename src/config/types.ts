import type { APP_CONFIG } from './schema';

export interface NumberSetting {
  type: 'number';
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  /** Measurement unit, e.g., "m/s", "rad/s" */
  unit?: string;
  /** Human-readable name for the setting */
  label: string;
  /** Tooltip or description for the setting */
  description?: string;
  /** If true, the value is not editable */
  readOnly?: boolean;
}

export interface StringSetting {
  type: 'string';
  defaultValue: string;
  label: string;
  description?: string;
  readOnly?: boolean;
}

export type ConfigSetting = NumberSetting | StringSetting;

export type ConfigSchema = {
  [key: string]: ConfigSchema | ConfigSetting;
};

// Utility type to make all properties in T optional, recursively
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};

// Helper type to check if T is a ConfigSetting
type IsConfigSetting<T> = T extends {
  type: 'number' | 'string';
  defaultValue: unknown;
}
  ? true
  : false;

// Helper type to extract the defaultValue type from a config setting
type ExtractValue<T> = T extends { type: 'number'; defaultValue: number }
  ? number
  : T extends { type: 'string'; defaultValue: string }
    ? string
    : never;

// Recursive mapped type to transform the config schema into a values-only type
type MapConfigToValues<T> = {
  [K in keyof T]: IsConfigSetting<T[K]> extends true
    ? ExtractValue<T[K]>
    : T[K] extends object
      ? MapConfigToValues<T[K]>
      : never;
};

// Final type representing the application settings
export type AppSettings = MapConfigToValues<typeof APP_CONFIG>;
