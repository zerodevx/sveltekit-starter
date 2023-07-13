#!/usr/bin/env zx

$.verbose = false

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

const name = argv._[0]
if (!name) {
  echo`Error: please specify the app name`
  process.exit(1)
}

await spinner('replace favicon', async () => {
  await fetch('https://raw.githubusercontent.com/zerodevx/sveltekit-starter/main/favicon.png').then(
    (r) => r.body.pipe(fs.createWriteStream(path.join(name, 'static', 'favicon.png')))
  )
})

await spinner('add tailwindcss', async () => {
  await $`cd ${name} && npx -y svelte-add@latest tailwindcss`
  await patchPackage(name, '+@tailwindcss/typography')
  await patchFiles(path.join(name, 'tailwind.config.cjs'), [
    `plugins: [`,
    `plugins: [require('@tailwindcss/typography'),`
  ])
})

await spinner('patch prettier', async () => {
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
})

await spinner('patch eslint', async () => {
  await patchFiles(path.join(name, '.eslintrc.cjs'), [
    `}\n};`,
    `},\n\trules: { 'no-tabs': 'error', 'no-unexpected-multiline': 'error' }\n};`
  ])
})

await spinner('add adapter-static', async () => {
  await patchFiles(path.join(name, 'svelte.config.js'), [`adapter-auto`, `adapter-static`])
  await patchPackage(name, '-@sveltejs/adapter-auto', '+@sveltejs/adapter-static')
  await fs.outputFile(
    path.join(name, 'src', 'routes', '+layout.js'),
    `export const prerender = true\n`
  )
})

await spinner('add fontsource', async () => {
  await patchPackage(name, '+@fontsource-variable/inter')
  await patchFiles(path.join(name, 'src', 'routes', '+layout.svelte'), [
    `<script>`,
    `<script>import '@fontsource-variable/inter';`
  ])
  await patchFiles(
    path.join(name, 'tailwind.config.cjs'),
    [`const config`, `const dt = require('tailwindcss/defaultTheme');\n\nconst config`],
    [`extend: {}`, `extend: { fontFamily: { sans: ['Inter Variable', ...dt.fontFamily.sans] } }`]
  )
})

await spinner('add iconify', async () => {
  await patchPackage(name, '+@iconify/tailwind', '+@iconify-json/mdi')
  await patchFiles(
    path.join(name, 'tailwind.config.cjs'),
    [`const dt`, `const { addDynamicIconSelectors } = require('@iconify/tailwind')\nconst dt`],
    [`plugins: [`, `plugins: [addDynamicIconSelectors(),`]
  )
  await patchFiles(path.join(name, 'src', 'routes', '+page.svelte'), [
    `</h1>`,
    `</h1>\n<span class="icon-[mdi--heart] w-8 h-8 text-red-600 animate-pulse" />\n`
  ])
})

echo`
All done! Complete the setup with:

$ cd ${name}
$ npx npm-check-updates -u
$ npm i
$ npm run format
`
