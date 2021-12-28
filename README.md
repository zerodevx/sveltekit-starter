# svelte-kit-starter

> Opinionated starter template for web projects

SvelteKit with Tailwind, ESLint, Prettier and a Static SPA Build.

## Usage

```bash
# Clone
$ npx degit zerodevx/svelte-kit-starter my-app
$ cd my-app

# Upgrade
$ npx npm-check-updates -u

# Install
$ npm i

# Develop
$ npm run dev -- --open

# Format and Lint
$ npm run format
$ npm run lint

# Build
$ npm run build
```

## Features

### Staging and Production builds

Often, there are slight differences between `staging` and `production` builds. For example, you'll
probably want to add the `noindex` meta for `staging` builds. This behaviour is
[baked in](https://github.com/zerodevx/svelte-kit-starter/blob/main/src/routes/__layout.svelte). To
access the build type within a Svelte component, do like so:

```html
<script>
  import { BUILD } from '$lib/env'
</script>

<p>Build Type: {BUILD}</p>
```

### App Versioning

App version is picked up from the `version` field in `package.json` and accessible within your app.
Use like so:

```html
<script>
  ...
  const VERSION = __APP_VERSION__
</script>

<p>The version number is v{VERSION}</p>
```

## Opinions

### Static SPA build

Uses [adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) to
pre-render `index.html` in all leaf (link) pages. This maintains SEO-bility. Leaf pages act as
entry-points to the SPA; thereafter the client-side router takes control. Why? Because servers
should just _serve_. The `/build` can then be uploaded to any static server.

**NOTE**: If you're using Github Pages, be sure to set `paths.base` to your repo (assuming that
you're serving from `<user>.github.io/<repo>/`). Also, set `trailingSlash: 'always'`.

### Tailwind CSS v3

Use Tailwind anywhere. You can use Tailwind utility classes like `bg-blue-700` in the markup
(components, routes, app.html). Use Tailwind directives like `@apply` and `@screen` or use the theme
function in Svelte `<style lang="postcss">` blocks or the `src/app.css` file. Configure Tailwind in
the `tailwind.config.cjs` file. CSS will be purged for production builds.

This starter also fixes the [FOUC](https://github.com/svelte-add/svelte-add/issues/137) issue.

Accordingly, `eslint-plugin-svelte3` is also set to `ignore-styles`.

### Prettier

The following configuration is used:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "proseWrap": "always",
  "svelteSortOrder": "options-scripts-markup-styles",
  "svelteIndentScriptAndStyle": false
}
```

#### No semis

So. Semicolons are **optional** in Javascript. Ironically, there are more rules to follow when using
semis than without.

```js
;[1, 2, 3].forEach(bar) // if you must, this is probably the only time you should use a semi;
```

Also, code looks cleaner too.

#### Use spaces

Modern IDEs are smart enough to discern a block with either spaces or tabs. However, Github at times
display an insane amount of whitespace when tabs are used. Just use spaces and get proper display
all the time.

#### Svelte sort order

This is set to `scripts-markup-styles` to
[optimize HMR](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-the-recommended-node-order-for-svelte-sfc-files).

### Linting

`eslint-plugin-html` is baked in to lint `<script>` tags in `.html` files too.
