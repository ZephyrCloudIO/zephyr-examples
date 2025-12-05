# SolidJS + TypeScript + Vite

A SolidJS application built with Vite bundler and TypeScript, providing fast development experience with fine-grained reactivity and modern tooling.

## Technology Stack

- **Framework**: SolidJS
- **Bundler**: Vite 6
- **Language**: TypeScript
- **Development**: Hot Module Replacement (HMR)
- **Build Plugin**: vite-plugin-solid
- **Deployment**: Zephyr Cloud (via vite-plugin-zephyr)

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
   
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

3. **Build for production**
   ```bash
   pnpm build
   ```
   
   Builds the app for production to the `dist` folder. It correctly bundles SolidJS in production mode and optimizes the build for the best performance.

4. **Preview production build**
   ```bash
   pnpm preview
   ```

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. The `vite-plugin-zephyr` handles the deployment process seamlessly.

## About SolidJS

SolidJS is a declarative, efficient, and flexible JavaScript library for building user interfaces. It offers:
- **Fine-grained reactivity**: Only updates what actually changes
- **No Virtual DOM**: Direct DOM updates for better performance
- **Familiar syntax**: JSX-based with React-like patterns

Learn more on the [SolidJS Website](https://solidjs.com) and join the community on [Discord](https://discord.com/invite/solidjs).

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [SolidJS Documentation](https://solidjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
