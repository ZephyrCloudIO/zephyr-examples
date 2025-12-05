# React Airbnb Clone - Micro-Frontend Architecture

A comprehensive Airbnb clone demonstrating micro-frontend architecture with Module Federation, showcasing how complex applications can be decomposed into independently deployable components.

## Technology Stack

- **Framework**: React 18 with React Router
- **Architecture**: Module Federation
- **Bundler**: Webpack 5
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud (via zephyr-webpack-plugin)

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (required for workspace management)

## Project Structure

This micro-frontend application is composed of multiple federated modules:

- **`react-host/`** - Main host application with routing and layout
- **`categories/`** - Property categories remote
- **`favorites/`** - Favorites management remote
- **`home/`** - Home page and search remote
- **`properties/`** - Property listings remote
- **`reservations/`** - Booking and reservations remote
- **`trips/`** - User trips management remote

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Development mode**
   ```bash
   pnpm dev
   ```
   
   This starts all micro-frontends concurrently for development.

3. **Build for production**
   ```bash
   # Build remotes first
   pnpm build-remotes
   
   # Then build the host
   pnpm build-host
   ```

## Zephyr Cloud Integration

This example demonstrates enterprise-scale micro-frontend deployment with Zephyr Cloud, showing how complex applications can be broken down into independently deployable and scalable components.

## About This Example

This Airbnb clone is based on [Antonio Erdeljac's Next.js example](https://github.com/AntonioErdeljac/next13-airbnb-clone) ([tutorial video](https://www.youtube.com/watch?v=c_-b_isI4vg&t=9493s)) and has been ported to vanilla React with React Router to showcase micro-frontend capabilities.

## Micro-Frontend Benefits Demonstrated

- **Independent Development**: Each team can work on separate modules
- **Independent Deployment**: Deploy individual features without affecting others
- **Technology Diversity**: Different modules can use different tech stacks
- **Scalability**: Scale individual modules based on demand
- **Fault Isolation**: Issues in one module don't break the entire application

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Module Federation Documentation](https://module-federation.io/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
