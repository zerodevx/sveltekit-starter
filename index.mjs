#!/usr/bin/env zx

import { create } from 'create-svelte' // @latest

if (!argv._.length) {
  echo`Error: please specify the app name`
  process.exit(1)
}
const name = argv._[0]
if (await fs.pathExists(name)) {
  if (!argv.o) {
    echo`Error: path ${path.sep}${name} already exists, specify -o flag to overwrite`
    process.exit(1)
  }
  await fs.remove(name)
}

async function patchFile(filename, pattern, replacement) {
  const infile = await fs.readFile(filename, 'utf8')
  await fs.writeFile(filename, infile.replace(pattern, replacement))
}

// Scaffold skeleton from `create-svelte`
const template = argv.t || 'skeleton'
await create(name, {
  name,
  template,
  types: 'checkjs',
  prettier: true,
  eslint: true,
  playwright: true,
  vitest: false
})
echo`- created ${template} template`

// Add `tailwindcss`
await $`cd ${argv._[0]} && npx svelte-add@latest tailwindcss`.quiet()
echo`- added tailwindcss`

// Patch `prettier`
await fs.writeJson(
  path.join(name, '.prettierrc'),
  {
    ...(await fs.readJson(path.join(name, '.prettierrc'))),
    printWidth: 100,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    proseWrap: 'always',
    svelteSortOrder: 'options-scripts-markup-styles',
    svelteIndentScriptAndStyle: false
  },
  { spaces: 2 }
)
echo`- patched prettier config`

// Patch `eslint`
await patchFile(
  path.join(name, '.eslintrc.cjs'),
  `}\n};`,
  `},\n\trules: { 'no-tabs': 'error', 'no-unexpected-multiline': 'error' }\n};`
)
echo`- patched eslint config`

// Use `adapter-static`
await patchFile(path.join(name, 'package.json'), `adapter-auto`, `adapter-static`)
await patchFile(path.join(name, 'svelte.config.js'), `adapter-auto`, `adapter-static`)
await fs.outputFile(
  path.join(name, 'src', 'routes', '+layout.js'),
  `export const prerender = true\n`
)
echo`- patched adapter-static`

echo`
All done! Complete the setup with:

$ cd ${name} && npm i && npm run format
`
