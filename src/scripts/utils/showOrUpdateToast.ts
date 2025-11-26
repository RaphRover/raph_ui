import {
  toast,
  type ToastContent,
  type ToastOptions,
  type Id,
  type UpdateOptions,
} from 'react-toastify';
import { APP_CONFIG } from '@/config';
import type { ConfigSetting } from '@/config';

const parseToastConfig = () => {
  const toastConfig = APP_CONFIG.toast;
  const parsedToastConfig: Record<string, string | number> = {};

  for (const key in toastConfig) {
    const setting = toastConfig[key as keyof typeof toastConfig];
    if (setting && typeof setting === 'object' && 'defaultValue' in setting) {
      parsedToastConfig[key] = (setting as ConfigSetting).defaultValue;
    }
  }

  return parsedToastConfig;
};

/**
 * Displays a new toast or updates an existing one if it's active.
 * This prevents duplicate toasts for the same logical event.
 *
 * @param content The content to render within the toast.
 * @param options Toast options, including a `toastId` to enable the update logic.
 * @returns The ID of the created or updated toast.
 */
export function showOrUpdateToast(
  content: ToastContent,
  options?: ToastOptions,
): Id {
  const defaultToastConfig = parseToastConfig();
  const toastOptions: ToastOptions = { ...defaultToastConfig, ...options };
  const toastId = options?.toastId;

  if (toastId && toast.isActive(toastId)) {
    const toastUpdateOptions: UpdateOptions = {
      ...toastOptions,
      render: content,
    };
    if (toastUpdateOptions.isLoading === false)
      toast.update(toastId, toastUpdateOptions);
    return toastId;
  }
  return toast(content, toastOptions);
}
