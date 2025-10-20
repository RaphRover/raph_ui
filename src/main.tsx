import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// CSS styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

// Other imports
import RaphNavbar from './components/Navbar/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RaphNavbar />
  </StrictMode>
)
