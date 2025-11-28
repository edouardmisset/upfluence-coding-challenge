import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  site: 'https://edouardmisset.github.io',
  base: '/upfluence-coding-challenge',
  integrations: [react(), vue(), svelte()],
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
