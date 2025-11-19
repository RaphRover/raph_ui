import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// CSS styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Other imports
import RaphNavbar from './components/Navbar/index.tsx';
import { ROSProvider } from '@scripts/context/ROSProvider.tsx';
import { Slide, ToastContainer } from 'react-toastify';
import StreamWindow from '@components/StreamWindow/index.tsx';
import { AppProvider } from '@scripts/context/AppProvider.tsx';
import RobotController from '@components/RobotController';
import VirtualJoystick from '@components/VirtualJoystick';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ROSProvider>
      <AppProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop={true}
          closeOnClick
          draggable
          theme="dark"
          transition={Slide}
          limit={5}
        />
        <RobotController />
        <VirtualJoystick />
        <div className="app-wrapper">
          <RaphNavbar />
          <StreamWindow />
        </div>
      </AppProvider>
    </ROSProvider>
  </StrictMode>,
);
