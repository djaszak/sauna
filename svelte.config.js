import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import { optimizeImports, optimizeCss } from 'carbon-preprocess-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [preprocess(), optimizeImports()],
  kit: {
    adapter: adapter(),
    target: '#svelte',
    methodOverride: {
      allowed: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
    vite: {
      plugins: [process.env.NODE_ENV === 'production' && optimizeCss()],
    },
  },
}

export default config
