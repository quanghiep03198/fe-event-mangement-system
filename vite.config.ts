/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
         find: '@'
      }
   },
   test: {
      globals: true,
      environment: 'jsdom',
      reporters: ['default', 'html']
   },
   esbuild: {
      drop: ['console', 'debugger']
   },
   preview: {
      port: 5000
   },
   server: {
      port: 5000,
      host: true,
      open: true
   }
})
