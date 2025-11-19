import {
  toast,
  type ToastContent,
  type ToastOptions,
  type Id,
} from 'react-toastify';
import { TOAST_CONFIG } from '@scripts/config/config';

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
  const toastId = options?.toastId;

  if (toastId && toast.isActive(toastId)) {
    const toastProps = { ...options, render: content };
    if (toastProps.isLoading === false) toastProps.autoClose = TOAST_CONFIG.AUTO_CLOSE_MS;
    toast.update(toastId, toastProps);
    return toastId;
  }
  return toast(content, options);
}
