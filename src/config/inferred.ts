import { APP_CONFIG } from './schema';
import type { AppSettings, ConfigSchema, ConfigSetting } from './types';

// Type guard to check if a node is a ConfigSetting
const isConfigSetting = (node: unknown): node is ConfigSetting => {
  return typeof node === 'object' && node !== null && 'defaultValue' in node;
};

const parseSchemaNode = (node: ConfigSchema | ConfigSetting): unknown => {
  // 1. If it's a leaf (setting), return its value
  if (isConfigSetting(node)) {
    return node.defaultValue;
  }

  // 2. If it's a branch (object), iterate further
  const result: Record<string, unknown> = {};

  // Object.entries is safe, keys are strings, values are unknown/Schema
  for (const [key, value] of Object.entries(node)) {
    // Recursion: we need to cast value to the expected input type,
    // because Object.entries returns the value type as a variance
    result[key] = parseSchemaNode(value as ConfigSchema | ConfigSetting);
  }

  return result;
};

// Main function to get the initial settings object
export const getInitialSettings = (): AppSettings => {
  // We can be sure APP_CONFIG matches ConfigSchema type
  return parseSchemaNode(APP_CONFIG) as AppSettings;
};
