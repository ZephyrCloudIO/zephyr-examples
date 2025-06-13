# React + Vite Host Application

The host application for the React + Vite Module Federation example, demonstrating how to consume multiple remote micro-frontends built with different bundlers.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Architecture**: Module Federation (Host)
- **Bundler**: Vite
- **Language**: TypeScript  
- **Deployment**: Zephyr Cloud
- **Development**: Vite Dev Server

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended)

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```
   
   The host application will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   pnpm build
   ```

4. **Preview production build**
   ```bash
   pnpm preview
   ```

## Module Federation Configuration

This host application is configured to consume remote micro-frontends:

- **Vite Remote**: Components from Vite-built remote application
- **Rspack Remote**: Components from Rspack-built remote application  
- **Webpack Remote**: Components from Webpack-built remote application

The host demonstrates how different bundlers can work together seamlessly in a Module Federation architecture.

## Development Workflow

For local development with all remotes:

1. Start this host application: `pnpm dev` (port 5173)
2. Start remote applications in parallel:
   - Vite remote: port 5174
   - Rspack remote: port 8080
   - Webpack remote: port 3000

## Zephyr Cloud Integration

This host application integrates with Zephyr Cloud for:

- **Remote Discovery**: Automatically finds and loads deployed remotes
- **Version Management**: Uses SemVer for remote versioning
- **Runtime Loading**: Loads remote applications at runtime
- **Deployment**: Automatic deployment when built

## About Module Federation

Module Federation enables this host to:
- **Runtime Composition**: Load remote components at runtime
- **Independent Deployment**: Remotes can deploy without host changes
- **Technology Diversity**: Consume remotes built with different bundlers
- **Shared Dependencies**: Share React and other libraries efficiently

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [Module Federation Documentation](https://module-federation.io/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)