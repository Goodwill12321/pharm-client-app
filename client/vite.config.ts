import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  preview: {
    host: true,
    allowedHosts: ['localhost', '127.0.0.1', 'dockerserver05', 'service.alterserv.ru','clientapp.alterserv.ru'],
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'ClientApp',
        name: 'Client App PWA',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
        description: 'PWA клиент для работы с системой заказов, задолженностями, накладными и сертификатами.'
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      },
    }),
  ],
  server: {
    host: true,
    allowedHosts: ['localhost', '127.0.0.1', 'dockerserver05', 'service.alterserv.ru', 'clientapp.alterserv.ru'],
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
