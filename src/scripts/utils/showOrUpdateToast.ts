import {
  toast,
  type ToastContent,
  type ToastOptions,
  type Id,
  type UpdateOptions,
} from 'react-toastify';
import { DEFAULT_TOAST_CONFIG } from '@scripts/config/config';

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
  const toastOptions: ToastOptions = { ...DEFAULT_TOAST_CONFIG, ...options };
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
