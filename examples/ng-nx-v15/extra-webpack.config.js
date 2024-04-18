const {withZephyr} = require('zephyr-webpack-plugin');

// shorthand for: module.exports = (config) => withZephyr({wait_for_index_html: true})(config);
module.exports = withZephyr({wait_for_index_html: true});

