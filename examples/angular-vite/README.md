# Angular + Vite

An Angular application built with Vite bundler, showcasing fast development experience with modern tooling and Zephyr Cloud integration.

## Technology Stack

- **Framework**: Angular 19
- **Bundler**: Vite 5
- **Language**: TypeScript
- **Development**: Hot Module Replacement (HMR)
- **Build Plugin**: @analogjs/vite-plugin-angular
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
   
   Navigate to `http://localhost:5173` to see the running application

3. **Build for production**
   ```bash
   pnpm build
   ```

4. **Preview production build**
   ```bash
   pnpm preview
   ```

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. The `vite-plugin-zephyr` handles the deployment process seamlessly.

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Angular Documentation](https://angular.io/)
- [Vite Documentation](https://vitejs.dev/)
- [AnalogJS Vite Plugin](https://analogjs.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
