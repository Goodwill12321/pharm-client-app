 import { defineConfig } from 'vite';
 import react from '@vitejs/plugin-react';
 import { VitePWA } from 'vite-plugin-pwa';
 import fs from 'fs';
 import path from 'path';

 // Read package.json and build-info.json to expose version/build to the app
 const pkgJsonPath = path.resolve(process.cwd(), 'package.json');
 const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')) as { version?: string };
 const buildInfoPath = path.resolve(process.cwd(), 'build-info.json');
 let buildInfo: { build?: number; buildTime?: string } = {};
 try {
   if (fs.existsSync(buildInfoPath)) {
     buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
   }
 } catch {}

 // Log startup info to Vite console
const startupInfo = {
  version: pkg.version ?? '0.0.0',
  build: buildInfo.build ?? 0,
  buildTime: buildInfo.buildTime ?? new Date().toISOString(),
  timestamp: new Date().toISOString()
};


export default defineConfig({
  preview: {
    host: true,
    allowedHosts: ['localhost', '127.0.0.1', 'dockerserver05', 'service.alterserv.ru','clientapp.alterserv.ru'],
    port: 5173,
  },
  plugins: [
    react(),
    {
      name: 'startup-logger',
      configureServer() {
        // This runs on vite dev
        const buildTime = buildInfo.buildTime ? 
            new Date(buildInfo.buildTime).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) : 
            new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

        console.log(`[${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}] VITE: Frontend application starting`, {
          version: pkg.version ?? '0.0.0',
          build: buildInfo.build ?? 0,
          buildTime: buildTime,
          mode: process.env.NODE_ENV || 'development'
        });
      },
      configurePreviewServer() {
        // This runs on vite preview
        const buildTime = buildInfo.buildTime ? 
            new Date(buildInfo.buildTime).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) : 
            new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

        console.log(`[${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}] VITE: Frontend preview starting`, {
          version: pkg.version ?? '0.0.0',
          build: buildInfo.build ?? 0,
          buildTime: buildTime,
          mode: 'preview'
        });
      }
    },
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
        runtimeCaching: [
          {
            urlPattern: /\.(?:html)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 3 * 60 * 60, // 3 часа
              },
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version ?? '0.0.0'),
    __BUILD_NUMBER__: JSON.stringify(String(buildInfo.build ?? 0)),
    __BUILD_TIME__: JSON.stringify(buildInfo.buildTime ?? new Date().toISOString()),
  },
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
