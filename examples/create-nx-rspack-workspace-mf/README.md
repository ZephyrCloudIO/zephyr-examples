# Nx + Rspack + Module Federation Workspace

A comprehensive Nx workspace demonstrating Module Federation architecture with Rspack bundler and multiple micro-frontend applications.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Architecture**: Module Federation
- **Build System**: Nx Workspace
- **Bundler**: Rspack
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud
- **Development**: Rspack Dev Server

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Project Structure

This Nx workspace consists of three federated applications:

- **`host/`** - Host application that orchestrates the micro-frontends
- **`remote1/`** - Remote application exposing shared components
- **`remote2/`** - Another remote application with independent functionality

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Development mode**
   
   Start all applications concurrently:
   ```bash
   npx nx run-many --target=serve --projects=remote1,remote2,host --parallel
   ```
   
   Or start individually:
   ```bash
   npx nx serve remote1
   npx nx serve remote2
   npx nx serve host
   ```

3. **Build for production** (in correct order)
   
   Because this is a Module Federation setup, remotes must be built before the host:
   
   ```bash
   npx nx run remote1:build
   npx nx run remote2:build
   npx nx run host:build
   ```
   
   Or use the convenience script that handles build order:
   ```bash
   npm run build
   ```

4. **Visual project graph**
   ```bash
   npx nx graph
   ```

## Module Federation Configuration

Each application uses Rspack's Module Federation plugin:

- **Host Application**: Consumes remote modules at runtime
- **Remote Applications**: Expose components for consumption
- **Shared Dependencies**: React, React-DOM shared as singletons
- **Build Dependencies**: Remotes must be built before host for proper mapping

## Rspack Benefits

This example showcases Rspack's advantages:
- **Faster builds**: Significantly faster than Webpack
- **Module Federation support**: First-class MF support
- **Webpack compatibility**: Easy migration from Webpack setups
- **Development experience**: Fast HMR and dev server

## Zephyr Cloud Integration

This example demonstrates enterprise-scale micro-frontend deployment:

1. **Build Order**: Remotes built and deployed first
2. **Automatic Mapping**: Zephyr Cloud maps remote entry points
3. **Runtime Loading**: Host consumes deployed remotes at runtime  
4. **Independent Deployment**: Each micro-frontend deploys separately

## About Module Federation

Module Federation enables:
- **Independent deployment**: Each micro-frontend can deploy separately
- **Runtime composition**: Applications compose at runtime, not build time
- **Team autonomy**: Different teams can own different remotes  
- **Technology flexibility**: Different versions of dependencies per remote
- **Shared dependencies**: Efficient sharing of common libraries

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Nx Documentation](https://nx.dev/)
- [Rspack Documentation](https://rspack.dev/)
- [Module Federation Documentation](https://module-federation.io/)
- [Zephyr Cloud Micro-Frontend Guide](https://docs.zephyr-cloud.io/how-to/mf-guide)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)