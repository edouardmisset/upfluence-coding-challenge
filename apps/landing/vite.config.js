import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2023',
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/react-viz': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
