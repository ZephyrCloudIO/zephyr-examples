# Svelte + TypeScript + Vite

A Svelte application built with Vite bundler and TypeScript, providing a minimal setup for fast development with HMR and modern tooling.

## Technology Stack

- **Framework**: Svelte
- **Bundler**: Vite 6
- **Language**: TypeScript
- **Development**: Hot Module Replacement (HMR)
- **Build Plugin**: @sveltejs/vite-plugin-svelte
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

5. **Type checking**
   ```bash
   pnpm check
   ```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. The `vite-plugin-zephyr` handles the deployment process seamlessly.

## About Svelte

Svelte is a radical new approach to building user interfaces. It offers:
- **Compile-time optimization**: No virtual DOM, compiles to vanilla JavaScript
- **Minimal runtime**: Smaller bundle sizes and better performance
- **Simple syntax**: Easy to learn and use

## Framework Alternatives

For more advanced features, consider [SvelteKit](https://github.com/sveltejs/kit#readme), which provides:
- Server-side rendering
- Built-in routing
- Serverless-first approach
- Additional tooling support

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Svelte Documentation](https://svelte.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
