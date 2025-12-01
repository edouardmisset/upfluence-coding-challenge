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
    optimizeDeps: {
      exclude: ['@upfluence/core', '@upfluence/styles'],
    },
  }
})
