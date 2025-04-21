import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupAutoUpdateSW } from './autoUpdateSW';
import App from './App';
import './index.css';
import './styles/global.css';

setupAutoUpdateSW();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
