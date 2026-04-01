const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withZephyr } = require('zephyr-metro-plugin');
const { withModuleFederation } = require('@module-federation/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const config = {
  resolver: { useWatchman: false },
  watchFolders: [path.resolve(__dirname, '../../node_modules')],
};

const getConfig = async () => {
  const zephyrConfig = await withZephyr()({
    name: 'MFTextEditor',
    filename: 'MFTextEditor.bundle',
    exposes: {
      './text-editor': './src/text-editor/text-editor.tsx',
    },
    shared: {
      react: {
        singleton: true,
        eager: false,
        requiredVersion: '19.1.0',
        version: '19.1.0',
        import: false,
      },
      'react-native': {
        singleton: true,
        eager: false,
        requiredVersion: '0.80.0',
        version: '0.80.0',
        import: false,
      },
      'react-native-pell-rich-editor': {
        singleton: false,
        eager: false,
        version: '1.10.0',
      },
      'react-native-webview': {
        singleton: false,
        eager: false,
        version: '13.15.0',
        import: false,
      },
    },
    shareStrategy: 'version-first',
  });

  return withModuleFederation(
    mergeConfig(getDefaultConfig(__dirname), config),
    zephyrConfig,
    {
      flags: {
        unstable_patchHMRClient: true,
        unstable_patchInitializeCore: true,
        unstable_patchRuntimeRequire: true,
      },
    }
  );
};

module.exports = getConfig;
