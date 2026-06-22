import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      // ── HOST CONFIG ──────────────────────────────────────────
      remotes: {
        auth: 'http://localhost:3001/assets/remoteEntry.js',
        dashboard: 'http://localhost:3002/assets/remoteEntry.js',
        task: 'http://localhost:3003/assets/remoteEntry.js',
        setting: 'http://localhost:3004/assets/remoteEntry.js',
        user: 'http://localhost:3005/assets/remoteEntry.js',
        management: 'http://localhost:3006/assets/remoteEntry.js',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shared: {
        react: { singleton: true, requiredVersion: '^19.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
        '@repo/store': { singleton: true, version: '0.0.0', requiredVersion: '0.0.0' },
      } as any,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
