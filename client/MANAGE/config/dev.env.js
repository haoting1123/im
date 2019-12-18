'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8080/rest/"',
  //BASE_API: '"http://47.105.141.1/syntoim/rest"'
})
