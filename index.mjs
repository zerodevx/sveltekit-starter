#!/usr/bin/env zx
/* global $, fs, path, argv, echo, spinner */

const name = argv._[0]
if (!name) {
  echo`Error: please specify the app name`
  process.exit(1)
}

const p = (...args) => path.join(name, ...args)

async function patchFiles(files, ...replacers) {
  for (const file of [files].flat()) {
    let contents = await fs.readFile(file, 'utf8')
    for (const [pattern, replacement] of replacers) {
      contents = contents.replace(pattern, replacement)
    }
    await fs.writeFile(file, contents)
  }
}

async function patchPackage(...dependencies) {
  const version = async (dep) => (await $`npm show ${dep} version`).stdout.trim()
  const file = p('package.json')
  let pkg = await fs.readJson(file)
  for (const dep of dependencies) {
    pkg.devDependencies[dep.slice(1)] =
      dep.charAt(0) === '+' ? `^${await version(dep.slice(1))}` : undefined
  }
  await fs.writeJson(file, pkg, { spaces: 2 })
}

let done
const loading = spinner('patching...', () => new Promise((resolve) => (done = resolve)))

const favicon = await fetch('https://cdn.jsdelivr.net/gh/zerodevx/sveltekit-starter/favicon.png')
  .then((r) => r.blob())
  .then((b) => b.arrayBuffer())
await fs.writeFile(p('static', 'favicon.png'), Buffer.from(favicon))

await patchPackage(
  '+tailwindcss',
  '+autoprefixer',
  '+@tailwindcss/typography',
  '+@fontsource-variable/inter',
  '+@iconify/tailwind',
  '+@iconify-json/mdi',
  '+prettier-plugin-tailwindcss',
  '-@sveltejs/adapter-auto',
  '+@sveltejs/adapter-static'
)

await fs.writeFile(
  p('tailwind.config.js'),
  `import { addIconSelectors } from '@iconify/tailwind'
import typography from '@tailwindcss/typography'
import dt from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', ...dt.fontFamily.sans]
      }
    }
  },
  plugins: [addIconSelectors(['mdi']), typography]
}`
)

await fs.writeFile(
  p('postcss.config.js'),
  `/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}`
)

await fs.writeFile(
  p('src', 'app.css'),
  `/* Write your global styles here, in PostCSS syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;`
)

await fs.writeFile(
  p('src', 'routes', '+layout.svelte'),
  `<script>
import '@fontsource-variable/inter'
import '../app.css'
</script>

<slot />`
)

await fs.writeFile(p('src', 'routes', '+layout.js'), `export const prerender = true\n`)

await patchFiles(p('src', 'routes', '+page.svelte'), [
  `</h1>`,
  `</h1>\n<span class="iconify mdi--heart text-xl text-red-600 animate-pulse" />\n`
])

await patchFiles(
  p('svelte.config.js'),
  [`import`, `import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';\nimport`],
  [
    `adapter-auto';`,
    `adapter-static';\nimport { readFileSync } from 'node:fs';\n\nconst { version: name } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'));`
  ],
  [`adapter()`, `adapter({fallback:'404.html'}), version:{name}`],
  [`\n};`, `, preprocess: [vitePreprocess()]\n};`]
)

await patchFiles(p('eslint.config.js'), [
  `languageOptions`,
  `rules:{'no-tabs':'error','no-unexpected-multiline':'error'}, languageOptions`
])

const prettier = await fs.readJson(p('.prettierrc'))
prettier.plugins = [...prettier.plugins, 'prettier-plugin-tailwindcss']
await fs.writeJson(p('.prettierrc'), {
  ...prettier,
  printWidth: 100,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  proseWrap: 'always',
  svelteSortOrder: 'options-scripts-markup-styles',
  svelteIndentScriptAndStyle: false
})

done()
await loading

echo`
All done! Complete the setup with:

$ cd ${name}
$ npm update --save
$ npm run format
`
