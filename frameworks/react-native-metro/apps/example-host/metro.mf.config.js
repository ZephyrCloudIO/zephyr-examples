const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
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
  const mfConfig = {
    name: 'MFExampleHost',
    remotes: {
      MFTextEditor: 'MFTextEditor@http://localhost:8082/mf-manifest.json',
      MFNotesList: 'MFNotesList@http://localhost:8083/mf-manifest.json',
    },
    shared: {
      react: {
        singleton: true,
        eager: true,
        requiredVersion: '19.1.0',
        version: '19.1.0',
      },
      'react-native': {
        singleton: true,
        eager: true,
        requiredVersion: '0.80.0',
        version: '0.80.0',
      },
      'react-native-pell-rich-editor': {
        singleton: true,
        eager: true,
        version: '1.10.0',
      },
      'react-native-webview': {
        singleton: true,
        eager: true,
        version: '13.15.0',
        import: false,
      },
    },
    shareStrategy: 'loaded-first',
    plugins: [path.resolve(__dirname, './runtime-plugin.ts')],
  };
  return withModuleFederation(
    mergeConfig(getDefaultConfig(__dirname), config),
    mfConfig,
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
