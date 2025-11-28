import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://edouardmisset.github.io',
  base: '/upfluence-coding-challenge',
  integrations: [react()],
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
    optimizeDeps: {
      exclude: ['@upfluence/core'],
    },
    server: {
      watch: {
        ignored: ['!**/node_modules/@upfluence/**']
      }
    }
  }
})
