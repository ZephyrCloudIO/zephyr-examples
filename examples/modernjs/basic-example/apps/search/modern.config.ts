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
    port: 3004,
  },
  dev: {
    assetPrefix: 'http://localhost:3004',
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
          name: 'search__REMOTE_VERSION__',
          library: { type: 'var', name: 'search__REMOTE_VERSION__' },
          filename: 'remoteEntry.js',
          remotes: {
            nav: DashboardPlugin.clientVersion({
              currentHost: 'search',
              remoteName: 'nav',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
            dsl: DashboardPlugin.clientVersion({
              currentHost: 'search',
              remoteName: 'dsl',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
            home: DashboardPlugin.clientVersion({
              currentHost: 'search',
              remoteName: 'home',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
            utils: DashboardPlugin.clientVersion({
              currentHost: 'search',
              remoteName: 'utils',
              dashboardURL: `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`,
            }),
          },
          exposes: {
            './SearchList': './src/components/SearchList',
            './MiniSearch': './src/components/MiniSearch',
          },
          shared: packageJsonDependencies,
        }),
        new DashboardPlugin({
          versionStrategy: 'buildHash',
          filename: 'dashboard.json',
          dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
          metadata: {
            baseUrl: 'http://localhost:3004',
            source: {
              url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/search',
            },
            remote: 'http://localhost:3004/remoteEntry.js',
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
