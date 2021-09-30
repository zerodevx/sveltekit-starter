module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-tabs': 'error',
    'no-unexpected-multiline': 'error'
  },
  overrides: [
    { files: ['*.svelte'], plugins: ['svelte3'], processor: 'svelte3/svelte3' },
    { files: ['*.html'], plugins: ['html'] }
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  }
}
