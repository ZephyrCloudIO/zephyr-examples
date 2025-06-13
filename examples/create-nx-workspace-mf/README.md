
# Nx Workspace with Module Federation

A comprehensive Nx workspace demonstrating Module Federation architecture with multiple micro-frontend applications.

## Technology Stack

- **Framework**: React with TypeScript
- **Architecture**: Module Federation
- **Build System**: Nx Workspace
- **Bundler**: Webpack 5
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Project Structure

This workspace consists of three federated applications:

- **`shell/`** - Host application that orchestrates the micro-frontends
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
   npx nx run-many --target=serve --projects=remote1,remote2,shell --parallel
   ```
   
   Or start individually:
   ```bash
   npx nx serve remote1
   npx nx serve remote2
   npx nx serve shell
   ```

3. **Build for production** (in correct order)
   
   Because this is a Micro-frontend application, remotes must be built before the host:
   
   ```bash
   npx nx run remote1:build
   npx nx run remote2:build
   npx nx run shell:build
   ```
   
   Or build all at once (Nx handles dependencies):
   ```bash
   npx nx run-many --target=build --projects=remote1,remote2,shell
   ```

## Module Federation Architecture

- **Remote Applications** (`remote1`, `remote2`) expose components that can be consumed by other applications
- **Host Application** (`shell`) consumes and orchestrates the remote applications
- **Build Order Dependency**: Remotes must be built first so Zephyr Cloud can map remote applications to the host

## Zephyr Cloud Integration

This example demonstrates enterprise-scale micro-frontend deployment where:

1. Remote applications are built and deployed first
2. Zephyr Cloud maps the remote entry points
3. The shell (host) application consumes the deployed remotes
4. Independent deployment cycles for each micro-frontend

## About Module Federation

Module Federation enables:
- **Independent deployment**: Each micro-frontend deploys separately
- **Runtime composition**: Applications compose at runtime, not build time  
- **Team autonomy**: Different teams can own different remotes
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
- [Module Federation Documentation](https://module-federation.io/)
- [Micro-Frontend Guide](https://docs.zephyr-cloud.io/how-to/mf-guide)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
