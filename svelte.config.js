import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
import fs from 'fs'

/** @type {import('@sveltejs/kit').Config} */

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'))

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false
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
