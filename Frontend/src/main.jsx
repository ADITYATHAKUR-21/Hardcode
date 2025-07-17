import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Adi from './Adi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Adi/>
  
  </StrictMode>,
)
