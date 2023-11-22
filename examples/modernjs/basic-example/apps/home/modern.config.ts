import path from 'node:path';
import { appTools, defineConfig } from '@modern-js/app-tools';
import DashboardPlugin from '@module-federation/dashboard-plugin';
import packageJson from './package.json';

const packageJsonDependencies = packageJson.dependencies;

const dashboardURL = `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`;

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  server: {
    port: 3001,
  },
  dev: {
    // set publicPath
    assetPrefix: 'http://localhost:3001',
  },
  source: {
    enableAsyncEntry: true,
  },
  output: {
    tempDir: path.join(__dirname, '.modern-js/tmp'),
  },
  html: {
    templateParameters: {
      htmlWebpackPlugin: {
        excludeChunks: ['remoteEntry'],
      }
    }
  },
  tools: {
    webpack(config, { webpack, appendPlugins }) {
      delete config.optimization?.splitChunks;
      // modern.js set runtimeChunk true by default
      delete config.optimization?.runtimeChunk;
      appendPlugins([
        new webpack.container.ModuleFederationPlugin({
          name: 'home',
          filename: 'remoteEntry.js',
          library: { type: 'var', name: 'home' },
          remotes: {
            dsl: DashboardPlugin.clientVersion({
              currentHost: 'home',
              remoteName: 'dsl',
              dashboardURL,
            }),
            search: DashboardPlugin.clientVersion({
              currentHost: 'home',
              remoteName: 'search',
              dashboardURL,
            }),
            nav: DashboardPlugin.clientVersion({
              currentHost: 'home',
              remoteName: 'nav',
              dashboardURL,
            }),
            utils: DashboardPlugin.clientVersion({
              currentHost: 'home',
              remoteName: 'utils',
              dashboardURL,
            }),
          },
          exposes: {
            './ProductCarousel': './src/components/ProductCarousel',
            './HeroImage': './src/components/HeroImage',
          },
          shared: packageJsonDependencies,
        }),
        new DashboardPlugin({
          versionStrategy: 'buildHash',
          filename: 'dashboard.json',
          dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
          versionChangeWebhook: 'http://cnn.com/',
          metadata: {
            clientUrl: process.env.DASHBOARD_BASE_URL,
            baseUrl: 'http://localhost:3001',
            source: {
              url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/home',
            },
            remote: 'http://localhost:3001/remoteEntry.js',
          },
        }),
      ]);
    },
  },
  plugins: [appTools()],
});
