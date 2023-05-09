# sveltekit-starter

> Opinionated starter template for SvelteKit

The Svelte-world is akin to the universes of
[Mad Max](https://en.wikipedia.org/wiki/Mad_Max:_Fury_Road) and
[Split](<https://en.wikipedia.org/wiki/Split_(2016_American_film)>) collided - full of peril,
violent sandstorms and new beginnings with a touch of disassociative personality disorder.

To help navigate through this madness, just like how Moses parted the Red Sea, behold the emergence
of this repo. Cue angels singing. The best way to describe this is it's like a brick-layer - but
instead of bricks are Svelte's somewhat arbitrary building blocks. And instead of cement are my
opinions.

So let's get started.

## Usage

### Create Svelte

Generate the base template using `create-svelte` with these recommended options:

- [x] Skeleton project
- [x] JavaScript with JSDoc comments
- [x] ESLint, Prettier and Playwight/Vitest

```
$ npm create svelte@latest my-app
```

### Run combo-patcher

Then, layer the patches based on the last-known SvelteKit decisions. This uses
[zx](https://github.com/google/zx), so make sure that's installed.

```
$ zx https://cdn.jsdelivr.net/gh/zerodevx/svelte-starter@2/index.mjs my-app
```

### Update dependencies

Finally, apply the finishing touches.

```
$ cd my-app
$ npx npm-check-updates -u
$ npm i
$ npm run format
```

## Opinions

### SvelteKit

Base `create-svelte` skeleton template with `jsdoc`, `prettier`, `eslint` and `playwright`.

### Tailwind CSS

Adds `tailwindcss` using `svelte-add`, then adds `tailwindcss/typography`.

### Prettier config

No semicolons; because they're redundant. Also use spaces over tabs - modern code editors handle
both well, but spaces display better outside IDEs (I'm looking at you Github).

```json
{
  // ...
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

```js
module.exports = {
  ...
  rules: {
    'no-tabs': 'error',
    'no-unexpected-multiline': 'error'
  }
}
```

### Static site setup

Seriously, don't use SSR unless you really need to. Installs `adapter-static` and adds sensible
defaults.

### Custom fonts

Use `fontsource` for self-hosted open-source fonts.

### Custom icons

Use `iconify` to create your own tree-shaken open-source icon set. Add icons in `/src/lib/icons.js`.

## License

ISC
