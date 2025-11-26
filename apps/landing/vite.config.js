import { defineConfig } from 'vite'

export default defineConfig({
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
