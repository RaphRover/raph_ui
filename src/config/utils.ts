import type { RecursivePartial } from './types';

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge<T>(target: T, source: RecursivePartial<T>): T {
  if (!isObject(target) || !isObject(source)) {
    return source as unknown as T;
  }

  const output = { ...target } as unknown as Record<string, unknown>;
  const sourceKeyed = source as unknown as Record<string, unknown>;

  Object.keys(sourceKeyed).forEach((key) => {
    const sourceValue = sourceKeyed[key];
    const targetValue = output[key];

    if (Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(
        targetValue,
        sourceValue as RecursivePartial<typeof targetValue>,
      );
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  });

  return output as unknown as T;
}
