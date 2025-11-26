import {
  toast,
  type ToastContent,
  type ToastOptions,
  type Id,
  type UpdateOptions,
} from 'react-toastify';
import { APP_CONFIG } from '@/config';

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
  const toastConfig = APP_CONFIG.toast;
  const toastId = options?.toastId;

  if (toastId && toast.isActive(toastId)) {
    if (options?.type) {
      options.isLoading = false;
      options.autoClose =
        options.autoClose ?? toastConfig.autoCloseMs.defaultValue;
    }
    const toastUpdateOptions: UpdateOptions = {
      ...options,
      render: content,
    };
    toast.update(toastId, toastUpdateOptions);
    return toastId;
  }
  return toast(content, options);
}
