'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_URL: '"http://192.168.146.23/apishinta/public"',
  VUE_APP_TOKEN: '"token_pdtt"'
})
