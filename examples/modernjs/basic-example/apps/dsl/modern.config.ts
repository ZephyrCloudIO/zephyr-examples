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
    port: 3002,
  },
  dev: {
    assetPrefix: 'http://localhost:3002',
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
          name: 'dsl__REMOTE_VERSION__',
          library: { type: 'var', name: 'dsl__REMOTE_VERSION__' },
          filename: 'remoteEntry.js',
          remotes: {},
          exposes: {
            './Button': './src/components/Button',
            './Carousel': './src/components/Carousel',
            './TextField': './src/components/TextField',
          },
          shared: packageJsonDependencies,
        }),
        new DashboardPlugin({
          versionStrategy: 'buildHash',
          filename: 'dashboard.json',
          environment: 'development',
          dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
          metadata: {
            baseUrl: 'http://localhost:3002',
            source: {
              url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/dsl',
            },
            remote: 'http://localhost:3002/remoteEntry.js',
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
