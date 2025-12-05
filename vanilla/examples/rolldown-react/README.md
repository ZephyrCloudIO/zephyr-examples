# React + Rolldown

A React application built with Rolldown, a fast Rust-based bundler compatible with Rollup.

## Technology Stack

- **Framework**: React
- **Bundler**: Rolldown (Rust-based)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Deployment**: Zephyr Cloud

## Prerequisites

- Node.js (version 16 or higher)
- pnpm

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Build for production**
   ```bash
   pnpm build
   ```

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. After running the build command, your application will be deployed and a preview URL will be provided.

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Rolldown Documentation](https://rolldown.rs/)
- [React Documentation](https://reactjs.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)