import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import { optimizeImports } from 'carbon-preprocess-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [preprocess(), optimizeImports()],
  kit: {
    adapter: adapter(),
    methodOverride: {
      allowed: ['DELETE', 'PATCH'],
    },
  },
}

export default config
