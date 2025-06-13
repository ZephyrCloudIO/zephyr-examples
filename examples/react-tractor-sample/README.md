# React Tractor Sample - Nx + Webpack + Module Federation

A micro-frontend implementation of the classic Tractor Store demonstrating Module Federation with Nx workspace management and Webpack 5.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Architecture**: Module Federation
- **Build System**: Nx Workspace
- **Bundler**: Webpack 5
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud
- **Development**: Webpack Dev Server

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Project Structure

This Nx workspace consists of three federated teams/applications:

- **`team-red/`** - Host application that orchestrates the micro-frontends
- **`team-blue/`** - Remote application with product catalog functionality
- **`team-green/`** - Remote application with checkout and cart functionality

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Development mode**
   
   Start all applications:
   ```bash
   # Development servers will start on different ports
   npx nx serve team-red    # Host application
   npx nx serve team-blue   # Remote application
   npx nx serve team-green  # Remote application
   ```

3. **Build for production** (in correct order)
   
   Because this is a Module Federation setup, remotes must be built before the host:
   
   ```bash
   npx nx run team-green:build
   npx nx run team-blue:build
   npx nx run team-red:build
   ```
   
   Or use the convenience script:
   ```bash
   npm run build
   ```

4. **Individual team builds**
   ```bash
   npm run build:team-red
   npm run build:team-blue
   npm run build:team-green
   ```

## Module Federation Architecture

- **Host Application** (`team-red`) consumes and orchestrates the remote micro-frontends
- **Remote Applications** (`team-blue`, `team-green`) expose components that represent different business domains
- **Build Order Dependency**: Remotes must be built first so Zephyr Cloud can map remote applications to the host

## Zephyr Cloud Integration

This example demonstrates enterprise-scale micro-frontend deployment with Zephyr Cloud:

1. Remote applications are built and deployed first
2. Zephyr Cloud maps the remote entry points automatically
3. The host application consumes the deployed remotes at runtime
4. Independent deployment cycles for each team's micro-frontend

## About Module Federation

Module Federation enables:
- **Team autonomy**: Different teams can own different micro-frontends
- **Independent deployment**: Each team can deploy their part separately
- **Runtime composition**: Applications compose at runtime, not build time
- **Technology diversity**: Teams can use different versions of libraries
- **Shared dependencies**: Efficient sharing of common libraries like React

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
- [React Tractor Store Tutorial](https://micro-frontends.org/tractor-store/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)