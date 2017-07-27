var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

// BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://127.0.0.1:9090"',
})
