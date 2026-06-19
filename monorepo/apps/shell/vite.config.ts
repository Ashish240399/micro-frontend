import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      // ── HOST CONFIG ──────────────────────────────────────────
      // Add remote MFEs here as you create them:
      // remotes: {
      //   auth: 'http://localhost:3001/assets/remoteEntry.js',
      //   dashboard: 'http://localhost:3002/assets/remoteEntry.js',
      // },
      remotes: {},
      shared: {
        react: { singleton: true, requiredVersion: '^19.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
        zustand: { singleton: true },
        '@repo/store': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
