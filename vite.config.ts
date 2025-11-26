import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/ucf': {
        target: 'https://ucf.academicworks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ucf/, ''),
      },
      '/api/depaul': {
        target: 'https://depaul.academicworks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/depaul/, ''),
      },
      '/api/fiu': {
        target: 'https://fiu.academicworks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fiu/, ''),
      },
      '/api/clc': {
        target: 'https://clcillinois.academicworks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/clc/, ''),
      },
      '/api/slu': {
        target: 'https://slu.academicworks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/slu/, ''),
      },
      '/api/uccs': {
        target: 'https://uccs.academicworks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uccs/, ''),
      },
    },
  },
})
