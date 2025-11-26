import { useMediaQuery } from 'react-responsive';
import { Slide, ToastContainer, type ToastPosition } from 'react-toastify';
import { TOAST_CONFIG } from '@scripts/config/config';
// import { useAppContext } from '@scripts/context/AppContext';
// import { VIRTUAL_JOYSTICK_CONFIG } from '@scripts/config/config';
import styles from './styles.module.css';

export default function ToastContainerWrapper() {
  // const { isMenuVisible, isVirtualGamepadEnabled } = useAppContext();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  // const { SIZE_PX, MOBILE_SIZE_PX } = VIRTUAL_JOYSTICK_CONFIG;

  // Default toast properties (desktop)
  let hideProgressBar = false;
  let stacked = false;
  let position: ToastPosition = 'bottom-right';
  // let bottomOffset = undefined;
  // let rightOffset = undefined;

  let toastClassName;

  if (isMobile) {
    if (!isPortrait) {
      // Landscape mode on mobile
      toastClassName = styles.LandscapeMobile;
    } else {
      // Portrait mode on mobile
      toastClassName = styles.PortraitMobile;
    }
    position = 'top-center';
    stacked = true;
    hideProgressBar = true;
  }

  // if (isVirtualGamepadEnabled) {
  //   bottomOffset = `calc( var(--toastify-toast-bottom) + ${(isMobile ? MOBILE_SIZE_PX : SIZE_PX) + 20}px)`;
  // }
  // if (isMenuVisible && !isMobile) {
  //   rightOffset = 'calc( var(--toastify-toast-right) + 400px)';
  //   bottomOffset = undefined;
  // }

  return (
    <ToastContainer
      position={position}
      autoClose={TOAST_CONFIG.AUTO_CLOSE_MS}
      newestOnTop={true}
      closeOnClick
      draggable
      theme="dark"
      transition={Slide}
      limit={5}
      stacked={stacked}
      hideProgressBar={hideProgressBar}
      className={toastClassName}
      toastClassName={styles.ToastMobile}
      style={{
        transition: 'all 0.3s ease-in-out',
        // bottom: bottomOffset,
        // maxWidth: '80vw'
      }}
    />
  );
}
