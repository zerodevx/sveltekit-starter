const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const production = process.env.NODE_ENV === 'production'

const config = {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    production &&
      cssnano({
        preset: 'default'
      })
  ]
}

module.exports = config
