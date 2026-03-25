import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'sounds/*.mp3'],
      manifest: {
        name: 'NeuroSync Pro - Estimulación Neurosensorial',
        short_name: 'NeuroSync',
        description: 'Rutinas personalizadas de sonidos binaurales, frecuencia Schumann y estimulación multimodal',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,ogg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.mp3$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sounds-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})

