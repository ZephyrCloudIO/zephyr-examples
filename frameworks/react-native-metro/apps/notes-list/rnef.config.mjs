import { pluginMetroModuleFederation } from '@module-federation/metro-plugin-rnef';
import { platformAndroid } from '@rnef/platform-android';
// @ts-check
import { platformIOS } from '@rnef/platform-ios';
import { pluginMetro } from '@rnef/plugin-metro';
import { zephyrMetroRNEFPlugin } from 'zephyr-metro-rnef-plugin';

const isZephyr = Boolean(process.env.ZC);

/** @type {import('@rnef/config').Config} */
export default {
  bundler: pluginMetro(),
  platforms: {
    ios: platformIOS(),
    android: platformAndroid(),
  },
  remoteCacheProvider: null,
  plugins: [isZephyr ? zephyrMetroRNEFPlugin() : pluginMetroModuleFederation()],
};
