import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource/bruno-ace-sc/400.css';
import App from './app/App';
import './app/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
