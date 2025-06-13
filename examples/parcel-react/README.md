# Parcel + React

A React application built with Parcel bundler, showcasing modern frontend development with fast build times and zero configuration.

## Technology Stack

- **Framework**: React 19
- **Bundler**: Parcel 2.13
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud (via parcel-reporter-zephyr)

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
   
   The application will be available at `http://localhost:1234`

3. **Build for production**
   ```bash
   pnpm build
   ```

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built. The `parcel-reporter-zephyr` plugin handles the deployment process.

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Parcel Documentation](https://parceljs.org/)
- [React Documentation](https://reactjs.org/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)