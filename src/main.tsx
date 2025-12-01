import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// CSS styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


// Other imports
import RaphNavbar from './components/Navbar';
import { RosProvider } from '@/scripts/context/RosProvider';
import ToastContainerWrapper from '@/components/ToastContainerWrapper';
import StreamWindow from '@/components/StreamWindow';
import { AppProvider } from '@/scripts/context/AppProvider.tsx';
import RobotController from '@/components/RobotController';
import VirtualGamepad from '@/components/VirtualGamepad';
import ConfigDrawer from '@/components/ConfigDrawer';
import { ConfigProvider } from '@/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <RosProvider>
        <AppProvider>
          <ToastContainerWrapper />
          <RobotController />
          <VirtualGamepad />
          <div className="app-wrapper">
            <RaphNavbar />
            <StreamWindow />
            <ConfigDrawer />
          </div>
        </AppProvider>
      </RosProvider>
    </ConfigProvider>
  </StrictMode>,
);
