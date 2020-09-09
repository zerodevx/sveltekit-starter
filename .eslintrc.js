module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'standard'
  ],
  plugins: [
    'svelte3'
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    'no-multiple-empty-lines': 'off'
  }
}
