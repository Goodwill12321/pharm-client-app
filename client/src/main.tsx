import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupAutoUpdateSW } from './autoUpdateSW';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './styles/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { logger } from './utils/logger';

setupAutoUpdateSW();

 // Log app startup with version/build info
 logger.info('Frontend application started', {
   version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0',
   build: typeof __BUILD_NUMBER__ !== 'undefined' ? __BUILD_NUMBER__ : '0',
   buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
   mode: import.meta.env.MODE,
 });

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
