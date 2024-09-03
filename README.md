# sveltekit-starter

> Opinionated starter template for SvelteKit

Svelte-world is akin to the fiery aftermath when the universes of
[Mad Max](https://en.wikipedia.org/wiki/Mad_Max:_Fury_Road) and
[Split](<https://en.wikipedia.org/wiki/Split_(2016_American_film)>) collide - full of peril, violent
sandstorms and new beginnings with a touch of dissociative identity disorder.

To help navigate through this madness, just like how Moses parted the Red Sea, behold the emergence
of this repo. Cue angels singing. The best way to describe this is it's like a brick-layer - but
instead of bricks are Svelte's somewhat arbitrary building blocks. And instead of cement are my
opinions.

So let's get started.

## Usage

### Step 1: Create Svelte

Generate the base template using `create-svelte` with these recommended options:

- [x] Skeleton or Library project
- [x] JavaScript with JSDoc comments
- [x] Include ESLint, Prettier and Playwright

```
$ npm create svelte@latest my-app
```

### Step 2: Run the combo-patcher

Then, layer the patches based on the last-known SvelteKit decisions. This uses
[`zx`](https://github.com/google/zx), so make sure that's installed.

```
$ zx https://cdn.jsdelivr.net/gh/zerodevx/svelte-starter@2/index.mjs my-app
```

### Step 3: Update dependencies

Finally, apply the finishing touches.

```
$ cd my-app
$ npm update --save
$ npm run format
```

## Opinions

### SvelteKit

Base `create-svelte` skeleton template with `jsdoc`, `prettier`, `eslint` and `playwright`.

### Tailwind CSS

Adds `tailwindcss` and `prettier-plugin-tailwindcss` using `svelte-add`, then adds
`tailwindcss/typography`.

### Prettier config

No semicolons; because they're redundant. Also use spaces over tabs - modern code editors handle
both well, but spaces display better outside IDEs (I'm looking at you Github).

```json
{
  //...
  "printWidth": 100,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "proseWrap": "always",
  "svelteSortOrder": "options-scripts-markup-styles",
  "svelteIndentScriptAndStyle": false
}
```

### ESLint config

Add defence against `no-semi`:

```json
{
  //...
  "rules": {
    "no-tabs": "error",
    "no-unexpected-multiline": "error"
  }
}
```

### Static site setup

Seriously, don't use SSR unless you really need to. Installs `adapter-static` and adds sensible
defaults.

### Versioning

Use the `version` from `package.json` in SvelteKit's native versioning system, like so:

```js
import { version } from '$app/environment' // `version` string from `package.json`
```

### Fonts

Use `@fontsource-variable` for self-hosted open-source fonts.

### Icons

Use `@iconify/tailwind` plugin for high-performance css-only icons. Apply icon classes using
`iconify {prefix}--{name}`. Install icon sets at `@iconify-json/{prefix}`. Set icon size using
standard tailwind classes like `text-lg` or `w-6 h-6`. Only icons you use will be included in your
build. Read more at [Iconify](https://github.com/iconify/iconify/tree/main/plugins/tailwind).

## License

ISC
