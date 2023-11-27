import path from 'node:path';
import { appTools, defineConfig } from '@modern-js/app-tools';
import DashboardPlugin from '@module-federation/dashboard-plugin';
import packageJson from './package.json';

const packageJsonDependencies = packageJson.dependencies;

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  server: {
    port: 3005,
  },
  dev: {
    assetPrefix: 'http://localhost:3005',
  },
  source: {
    enableAsyncEntry: true,
  },
  output: {
    tempDir: path.join(__dirname, '.modern-js/tmp'),
  },
  tools: {
    webpack(config, { webpack, appendPlugins }) {
      appendPlugins([
        new webpack.container.ModuleFederationPlugin({
          name: 'utils__REMOTE_VERSION__',
          library: { type: 'var', name: 'utils__REMOTE_VERSION__' },
          filename: 'remoteEntry.js',
          remotes: {},
          exposes: {
            './analytics': './src/utils/analytics',
            './foo': './src/utils/foo',
          },
          shared: packageJsonDependencies,
        }),
        new DashboardPlugin({
          versionStrategy: 'buildHash',
          dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
          filename: 'dashboard.json',
          metadata: {
            baseUrl: 'http://localhost:3005',
            source: {
              url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/utils',
            },
            remote: 'http://localhost:3005/remoteEntry.js',
          },
        }),
      ]);
      delete config.optimization?.splitChunks;
      // modern.js set runtimeChunk true by default
      delete config.optimization?.runtimeChunk;
    },
  },
  plugins: [appTools()],
});
