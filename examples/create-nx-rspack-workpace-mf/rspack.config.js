const { composePlugins, withNx, withReact } = require('@nx/rspack');
const {withZephyr} = require('zephyr-webpack-plugin');

module.exports = composePlugins(withNx(), withReact(), withZephyr(), (config) => {
  return config;
});
