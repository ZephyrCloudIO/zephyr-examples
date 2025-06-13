# React + Rspack + Module Federation Application

A React application built with Rspack bundler demonstrating Module Federation capabilities with fast builds and modern development experience.

## Technology Stack

- **Framework**: React with TypeScript
- **Architecture**: Module Federation
- **Bundler**: Rspack
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended) or npm

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```
   
   The application will be available at `http://localhost:3000`

3. **Build for production**
   ```bash
   pnpm build
   ```

## Module Federation Configuration

This application is configured as a Module Federation container with:
- **Name**: `create_mf_app_rspack`
- **Remote Entry**: `remoteEntry.js`
- **Shared Dependencies**: React, React-DOM, React-Router-DOM (all eager loaded)

The application uses the `zephyr-rspack-plugin` for seamless integration with Zephyr Cloud deployment.

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. The Zephyr plugin handles Module Federation deployment, ensuring proper remote entry generation and dependency sharing. After running the build command, your application will be deployed and a preview URL will be provided.

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Rspack Documentation](https://rspack.dev/)
- [React Documentation](https://reactjs.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)