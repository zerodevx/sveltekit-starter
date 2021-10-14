import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
import fs from 'fs'
/** @type {import('@sveltejs/kit').Config} */

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'))

const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter({
      fallback: 'index.html'
    }),
    vite: () => ({
      define: {
        __APP_VERSION__: JSON.stringify(version)
      }
    })
  },
  preprocess: [
    preprocess({
      postcss: true
    })
  ],
  paths: {
    base: ''
  },
  ssr: false,
  trailingSlash: 'never'
}

export default config
