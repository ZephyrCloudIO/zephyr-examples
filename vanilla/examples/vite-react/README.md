# React + TypeScript + Vite

A React application built with Vite bundler and TypeScript, providing fast development experience with Hot Module Replacement (HMR) and modern tooling.

## Technology Stack

- **Framework**: React 18
- **Bundler**: Vite 5
- **Language**: TypeScript
- **Development**: HMR with Fast Refresh
- **Linting**: ESLint with TypeScript support
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
   
   The application will be available at `http://localhost:5173`

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

## ESLint Configuration

The project includes ESLint configuration with TypeScript support. For production applications, you can enhance the configuration with type-aware lint rules:

- Configure type-aware linting by updating `parserOptions`
- Use `plugin:@typescript-eslint/recommended-type-checked` for stricter rules
- Add `plugin:react/recommended` for React-specific linting

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
