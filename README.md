# svelte-kit-starter

> Opinionated starter template for web projects

SvelteKit with Tailwind, ESLint, Prettier and a Static SPA Build.

## Usage

1. Scaffold project with [degit](https://github.com/Rich-Harris/degit):

```
$ npx degit zerodevx/svelte-kit-starter my-app
$ cd my-app
```

2. Optionally, update dependencies with [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

```
$ npx npm-check-updates -u
```

3. Install dependencies:

```
$ npm i
```

4. Start the dev server:

```
$ npm run dev -- --open
```

5. Write your code, format and lint:

```
$ npm run format
$ npm run lint
```

6. Build the app (production build at `/build`):

```
$ npm run build
```

7. Optionally, preview the app locally:

```
$ npm run preview
```

## Opinions

### Static SPA Build

Uses [adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) to pre-render `index.html` in
all leaf (link) pages. This maintains SEO-bility. Leaf pages act as entry-points to the SPA; thereafter the client-side
router takes control. Why? Because servers should just _serve_. The `/build` can then be uploaded to any static server.

**NOTE**: If you're using Github Pages, be sure to set `paths.base` to your repo (assuming that you're serving from
`<user>.github.io/<repo>/`). Also, set `trailingSlash: 'always'`.

### Tailwind CSS

Use Tailwind anywhere. You can use Tailwind utility classes like bg-blue-700 in the markup (components, routes,
app.html). Use Tailwind directives like @apply and @screen or use the theme function in Svelte style lang="postcss"
blocks or the src/app.postcss file. Configure Tailwind in the `tailwind.config.cjs` file. CSS will be purged for
production builds.

### Prettier

The following configuration is used:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 120,
  "proseWrap": "always",
  "svelteSortOrder": "options-scripts-styles-markup",
  "svelteIndentScriptAndStyle": false
}
```

#### No semis

So. Semicolons are **optional** in Javascript. Ironically, there are more rules to follow when using semis. Without,
just remember not to start lines with `(` or `[`:

```js
;[1, 2, 3].forEach(bar) // if you must, this is the only time you should use a semi;
```

Also, code looks cleaner too.

#### Use spaces

Modern IDEs are smart enough to discern a block with either spaces or tabs. However, Github at times display an insane
amount of whitespace when tabs are used. Just use spaces and get proper display all the time.

### Linting

`eslint-plugin-html` is baked in to lint `.html` files too.
