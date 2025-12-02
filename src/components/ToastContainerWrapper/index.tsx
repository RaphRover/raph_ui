import { useMediaQuery } from 'react-responsive';
import {
  Slide,
  ToastContainer,
  type DraggableDirection,
  type ToastPosition,
} from 'react-toastify';
import { useConfigContext } from '@/config';
import { useAppContext } from '@/scripts/context/AppContext';

export default function ToastContainerWrapper() {
  const { settings } = useConfigContext();
  const autoCloseMs = settings.toast.autoCloseMs;
  const { isMenuVisible, isVirtualGamepadEnabled } = useAppContext();
  const isMobile = useMediaQuery({ maxWidth: 950 });
  const { sizePx } = settings.virtualGamepad;

  // Default toast properties (desktop)
  let hideProgressBar = false;
  let stacked = false;
  let position: ToastPosition = 'bottom-right';
  let draggableDirection: DraggableDirection = 'x';
  let bottomOffset = undefined;
  let rightOffset = undefined;

  if (isMobile) {
    // Mobile toasts configuration
    position = 'top-center';
    draggableDirection = 'y';
    stacked = true;
    hideProgressBar = true;
  } else {
    // Desktop toasts configuration
    if (isVirtualGamepadEnabled) {
      bottomOffset = `calc( var(--toastify-toast-bottom) + ${sizePx + 20}px)`;
    }
    if (isMenuVisible && !isMobile) {
      rightOffset = 'calc( var(--toastify-toast-right) + 400px)';
      bottomOffset = undefined;
    }
  }
  return (
    <ToastContainer
      autoClose={autoCloseMs}
      position={position}
      newestOnTop={true}
      closeOnClick
      draggable
      draggableDirection={draggableDirection}
      theme="dark"
      transition={Slide}
      limit={5}
      stacked={stacked}
      hideProgressBar={hideProgressBar}
      style={{
        transition: 'all 0.3s ease-in-out',
        bottom: bottomOffset,
        right: rightOffset,
      }}
    />
  );
}
