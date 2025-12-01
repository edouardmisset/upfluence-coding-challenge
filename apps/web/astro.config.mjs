import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'
import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
  site: 'https://edouardmisset.github.io',
  base: '/upfluence-coding-challenge',
  integrations: [
    react({ include: ['**/react-viz/**'] }),
    vue(),
    svelte(),
    preact({ include: ['**/preact-viz/**'] }),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@upfluence/core', '@upfluence/styles'],
    },
  }
})
