const getConfig = require('./metro.mf.config.js');
const getZephyrConfig = require('./metro.zc.config.js');

const isZephyr = Boolean(process.env.ZC);

module.exports = isZephyr ? getZephyrConfig() : getConfig();
