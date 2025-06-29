import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { FireBaseProvider } from './context/FireBase';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <FireBaseProvider>
      <App />
    </FireBaseProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
