#!/usr/bin/env zx

import { create } from 'create-svelte' // @latest

$.verbose = false

export async function patchFiles(filepaths, ...replacers) {
  for (const file of [filepaths].flat()) {
    let contents = await fs.readFile(file, 'utf8')
    for (const [pattern, replacement] of replacers) {
      contents = contents.replace(pattern, replacement)
    }
    await fs.writeFile(file, contents)
  }
}

export async function getVersion(pkg) {
  const version = await $`npm show ${pkg} version`
  return version.toString()
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
}

export async function addPrettier({ name }) {
  await fs.writeJson(path.join(name, '.prettierrc'), {
    ...(await fs.readJson(path.join(name, '.prettierrc'))),
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
  await patchFiles(
    [path.join(name, 'package.json'), path.join(name, 'svelte.config.js')],
    [`adapter-auto`, `adapter-static`]
  )
  await fs.outputFile(
    path.join(name, 'src', 'routes', '+layout.js'),
    `export const prerender = true\n`
  )
}

void (async function () {
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

  await addBaseTemplate(opts)
  echo`- created ${opts.template} template`
  await addTailwindcss(opts)
  echo`- added tailwindcss`
  await addPrettier(opts)
  echo`- patched prettier config`
  await addEslint(opts)
  echo`- patched eslint config`
  await addAdapterStatic(opts)
  echo`- added adapter-static`

  echo`\nAll done! Complete the setup with:\n`
  echo`$ cd ${opts.name}`
  echo`$ npx npm-check-updates -u`
  echo`$ npm i`
  echo`$ npm run format`
})()
