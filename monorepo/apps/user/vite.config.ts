import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: 'http://localhost:3005/',
  plugins: [
    react(),
    federation({
      name: 'user',
      // ── REMOTE CONFIG ────────────────────────────────────────
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shared: {
        react: { singleton: true, requiredVersion: '^19.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
        '@repo/store': { singleton: true },
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
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3005,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3005,
    strictPort: true,
    cors: true,
  },
})
