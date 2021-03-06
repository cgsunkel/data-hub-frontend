/* eslint-disable */
require('dotenv').config()

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  config.env.sandbox_url = process.env.API_ROOT
  return config
}
