# Webpack Module Federation Example

A basic Module Federation setup with two React applications demonstrating micro-frontend architecture using Webpack 5.

## Technology Stack

- **Framework**: React 18
- **Architecture**: Module Federation
- **Bundler**: Webpack 5
- **Language**: JavaScript
- **Deployment**: Zephyr Cloud
- **Development**: Webpack Dev Server

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended) or yarn/npm

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development servers**
   ```bash
   pnpm start
   ```
   
   This starts both applications concurrently:
   - **app1** (Host): http://localhost:3001
   - **app2** (Remote): http://localhost:3002
   
   Or start them individually:
   ```bash
   cd app1 && pnpm start  # Host on port 3001
   cd app2 && pnpm start  # Remote on port 3002
   ```

3. **Build for production**
   ```bash
   pnpm build
   ```

## Project Structure

This example consists of two federated applications:

- **`app1/`** - Host application that consumes remotes
- **`app2/`** - Remote application that exposes components

## Zephyr Cloud Integration

To use this example with Zephyr Cloud:

1. Build and deploy `app2` to Zephyr Cloud
2. Copy the deployment URL for the `remoteEntry.js` file
3. Update the `app2Url` variable in `/app1/src/index.js` with the Zephyr Cloud URL
4. Build and deploy `app1`

## Module Federation Configuration

Each application has its own `webpack.config.js` with Module Federation plugin configuration:

- **app1**: Configured as a host to consume remote modules
- **app2**: Configured as a remote to expose components

## About Module Federation

Module Federation enables:
- **Independent deployment**: Each micro-frontend can be deployed separately
- **Runtime composition**: Applications are composed at runtime, not build time
- **Shared dependencies**: Efficient sharing of common libraries
- **Technology diversity**: Different teams can use different tech stacks

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Module Federation Documentation](https://module-federation.io/)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
