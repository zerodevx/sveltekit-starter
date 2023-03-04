#!/usr/bin/env zx

import { create } from 'create-svelte' // @latest

$.verbose = false

// Fix stupid `zx -i` logic (https://github.com/google/zx/blob/main/src/deps.ts)
const SHIM_I = 'imp' + 'ort'
const SHIM_F = 'fr' + 'om'
const SHIM_R = 'req' + 'uire'

async function patchFiles(files, ...replacers) {
  for (const file of [files].flat()) {
    let contents = await fs.readFile(file, 'utf8')
    for (const [pattern, replacement] of replacers) {
      contents = contents.replace(pattern, replacement)
    }
    await fs.writeFile(file, contents)
  }
}

async function patchPackage(name, ...dependencies) {
  const version = async (dep) => (await $`npm show ${dep} version`).stdout.trim()
  const file = path.join(name, 'package.json')
  let pkg = await fs.readJson(file)
  for (const dep of dependencies) {
    pkg.devDependencies[dep.slice(1)] =
      dep.charAt(0) === '+' ? `^${await version(dep.slice(1))}` : undefined
  }
  await fs.writeJson(file, pkg, { spaces: 2 })
}

export async function addBaseTemplate({ name, template }) {
  await fs.remove(name)
  await create(name, {
    name,
    template,
    types: 'checkjs',
    prettier: true,
    eslint: true,
    playwright: true,
    vitest: false
  })
  await fetch('https://raw.githubusercontent.com/zerodevx/sveltekit-starter/main/favicon.png').then(
    (r) => r.body.pipe(fs.createWriteStream(path.join(name, 'static', 'favicon.png')))
  )
}

export async function addTailwindcss({ name }) {
  await $`cd ${name} && npx -y svelte-add@latest tailwindcss`
  await patchPackage(name, '+@tailwindcss/typography')
  await patchFiles(path.join(name, 'tailwind.config.cjs'), [
    'plugins: []',
    `plugins: [${SHIM_R}('@tailwindcss/typography')]`
  ])
}

export async function addPrettier({ name }) {
  const file = path.join(name, '.prettierrc')
  await fs.writeJson(file, {
    ...(await fs.readJson(file)),
    printWidth: 100,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    proseWrap: 'always',
    svelteSortOrder: 'options-scripts-markup-styles',
    svelteIndentScriptAndStyle: false
  })
}

export async function addEslint({ name }) {
  await patchFiles(path.join(name, '.eslintrc.cjs'), [
    `}\n};`,
    `},\n\trules: { 'no-tabs': 'error', 'no-unexpected-multiline': 'error' }\n};`
  ])
}

export async function addAdapterStatic({ name }) {
  await patchFiles(path.join(name, 'svelte.config.js'), [`adapter-auto`, `adapter-static`])
  await patchPackage(name, '-@sveltejs/adapter-auto', '+@sveltejs/adapter-static')
  await fs.outputFile(
    path.join(name, 'src', 'routes', '+layout.js'),
    `export const prerender = true\n`
  )
}

export async function addFontsource({ name }) {
  await patchPackage(name, '+@fontsource/inter')
  await patchFiles(path.join(name, 'src', 'routes', '+layout.svelte'), [
    `<script>`,
    `<script>${SHIM_I} '@fontsource/inter/variable.css';`
  ])
  await patchFiles(
    path.join(name, 'tailwind.config.cjs'),
    [`const config`, `const dt = ${SHIM_R}('tailwindcss/defaultTheme');\n\nconst config`],
    [`extend: {}`, `extend: { fontFamily: { sans: ['InterVariable', ...dt.fontFamily.sans] } }`]
  )
}

export async function addIconify({ name }) {
  await patchPackage(name, '+@iconify/svelte', '+@iconify-icons/mdi')
  await fs.outputFile(
    path.join(name, 'src', 'lib', 'icons.js'),
    `${SHIM_I} Icon, { addIcon } ${SHIM_F} '@iconify/svelte/dist/OfflineIcon.svelte';\n${SHIM_I} check ${SHIM_F} '@iconify-icons/mdi/check';\n\naddIcon('check', check);\n\nexport { Icon as default }\n`
  )
  await patchFiles(
    path.join(name, 'src', 'routes', '+page.svelte'),
    [`<h1>`, `<script>${SHIM_I} Icon ${SHIM_F} '$lib/icons'</script>\n\n<h1>`],
    [`</p>`, `</p>\n\n<Icon class="w-12 h-12" icon='check' />\n`]
  )
}

const opts = {
  name: argv._[0],
  template: argv.t || 'skeleton'
}
if (!opts.name) {
  echo`Error: please specify the app name`
  process.exit(1)
}
if ((await fs.pathExists(opts.name)) && !argv.o) {
  echo`Error: path ${path.sep}${opts.name} already exists, specify -o flag to overwrite`
  process.exit(1)
}

await addBaseTemplate(opts).then(() => echo`- created ${opts.template} template`)
await addTailwindcss(opts).then(() => echo`- added tailwindcss`)
await addPrettier(opts).then(() => echo`- patched prettier config`)
await addEslint(opts).then(() => echo`- patched eslint config`)
await addAdapterStatic(opts).then(() => echo`- added adapter-static`)
await addFontsource(opts).then(() => echo`- added fontsource`)
await addIconify(opts).then(() => echo`- added iconify`)

echo`
All done! Complete the setup with:

$ cd ${opts.name}
$ npx npm-check-updates -u
$ npm i
$ npm run format
`
