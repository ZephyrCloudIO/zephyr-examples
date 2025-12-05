# Modern.js + React Application

A React application built with Modern.js framework and Rspack, providing a full-stack development experience with modern tooling and conventions.

## Technology Stack

- **Framework**: Modern.js with React
- **Bundler**: Rspack (built-in)
- **Language**: TypeScript
- **Routing**: File-based routing
- **Linting**: Biome
- **Deployment**: Zephyr Cloud
- **Features**: SSR, File-based routing, Plugin system

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (required for Modern.js)

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```
   
   The application will be available at `http://localhost:8080`

3. **Add new features or entries**
   ```bash
   pnpm new
   ```
   
   Interactive CLI to enable optional features or add new entries

4. **Build for production**
   ```bash
   pnpm build
   ```

5. **Preview production build**
   ```bash
   pnpm serve
   ```

## Project Structure

Modern.js uses file-based routing and conventions:

```
├── src/
│   └── routes/          # File-based routing
│       ├── layout.tsx   # Root layout
│       └── page.tsx     # Home page
├── modern.config.ts     # Modern.js configuration
└── biome.json          # Biome configuration
```

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. Modern.js provides excellent integration with various deployment platforms.

## About Modern.js

Modern.js is a meta-framework for building web applications that provides:
- **Progressive enhancement**: Start simple, add complexity as needed
- **Full-stack capabilities**: Frontend and backend in one framework
- **Performance-first**: Built with Rspack for fast builds
- **Convention over configuration**: Sensible defaults with flexibility
- **Plugin ecosystem**: Extensible architecture

## Available Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm new` - Interactive CLI for adding features
- `pnpm lint` - Run Biome linter
- `pnpm type-check` - Run TypeScript type checking

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Modern.js Documentation](https://modernjs.dev/en)
- [Modern.js GitHub](https://github.com/web-infra-dev/modern.js)
- [Rspack Documentation](https://rspack.dev/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
