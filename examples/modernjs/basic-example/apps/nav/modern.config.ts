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
    port: 3003,
  },
  dev: {
    assetPrefix: 'http://localhost:3003',
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
          name: 'nav__REMOTE_VERSION__',
          library: { type: 'var', name: 'nav__REMOTE_VERSION__' },
          filename: 'remoteEntry.js',
          remotes: {
            dsl: DashboardPlugin.clientVersion({
              currentHost: 'nav',
              remoteName: 'dsl',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
            search: DashboardPlugin.clientVersion({
              currentHost: 'nav',
              remoteName: 'search',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
            utils: DashboardPlugin.clientVersion({
              currentHost: 'nav',
              remoteName: 'utils',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
          },
          exposes: {
            './Header': './src/components/Header',
            './Footer': './src/components/Footer',
          },
          shared: packageJsonDependencies,
        }),
        new DashboardPlugin({
          versionStrategy: 'buildHash',
          filename: 'dashboard.json',
          dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
          versionChangeWebhook: 'http://cnn.com/',
          metadata: {
            baseUrl: 'http://localhost:3003',
            source: {
              url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/nav',
            },
            remote: 'http://localhost:3003/remoteEntry.js',
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
