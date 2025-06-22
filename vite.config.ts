// vite.config.ts
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [tsConfigPaths(), tanstackStart({ target: 'vercel' })],
  resolve: {
    alias: {
      '@': '/src',
    },
  }
})