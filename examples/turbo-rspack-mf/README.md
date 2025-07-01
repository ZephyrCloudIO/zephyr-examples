# Turbo + Rspack + Module Federation Starter

A comprehensive Turborepo demonstrating Module Federation architecture with Rspack bundler and multiple micro-frontend applications.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Architecture**: Module Federation
- **Build System**: Turborepo
- **Bundler**: Rspack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Zephyr Cloud
- **Development**: Rspack Dev Server

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (required for Turborepo)

## Using this example

Run the following command:

```sh
npx create-turbo@latest --example https://github.com/swalker326/ze-starter-turbo
```

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Zephyr Setup**
   Update all the occurences of `zephyr:turbo_host@*` to be `zephyr:turbo_host.[your_project_name].[your_organiztion]@*` where your `your_project_name` and `your_organization` are from zephyr cloud
3. **Development mode**
   ```bash
   pnpm dev
   ```
   
   This starts all applications concurrently:
   - **Host**: http://localhost:3000 (main application)
   - **Home**: http://localhost:3001 (remote micro-frontend)
   - **Settings**: http://localhost:3002 (remote micro-frontend)

4. **Build for production**
   ```bash
   pnpm build
   ```
   
   Or using Turbo directly:
   ```bash
   turbo build
   ```

5. **Other commands**
   ```bash
   pnpm lint     # Lint all packages
   pnpm check    # Run Biome checks
   pnpm format   # Format code
   ```

## Project Structure

This Turborepo includes the following packages/apps:

### Apps and Packages

**Rspack Applications with Module Federation:**
- **`host`** - Main host application that consumes remote micro-frontends
- **`home`** - Remote micro-frontend with home page functionality
- **`settings`** - Remote micro-frontend with settings and routing (React Router)

**Shared Packages:**
- **`@repo/tailwind-config`** - Global Tailwind CSS configurations 
- **`@repo/typescript-config`** - Shared TypeScript configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biomejs](https://biomejs.dev/guides/getting-started/) for formatting and linting

### Module Federation Architecture

This example demonstrates a complete micro-frontend setup:

- **Host Application**: Orchestrates and consumes all remote micro-frontends
- **Remote Applications**: Independent micro-frontends that can be deployed separately
- **Build Dependencies**: Remotes must be built before host for proper module mapping
- **Runtime Loading**: Host loads remotes dynamically at runtime

### Build Order for Zephyr Cloud

For Zephyr Cloud deployment, remote applications need to be built first:

```bash
# Build order is handled automatically by Turbo
turbo build
```

This ensures Zephyr Cloud can properly map remote applications before the host consumes them.

## Zephyr Cloud Integration

This example shows enterprise-scale micro-frontend deployment:

1. **Git Integration**: Publish project to any git provider (public or private)
2. **Automatic Building**: Turbo handles build order dependencies
3. **Deployment**: Each build triggers Zephyr Cloud deployment
4. **Runtime Composition**: Host loads deployed remotes at runtime

## Turborepo Benefits

- **Task Pipeline**: Efficient task orchestration across packages
- **Incremental Builds**: Only rebuild what changed
- **Remote Caching**: Share build cache across team and CI
- **Parallel Execution**: Run tasks across packages in parallel

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## About Module Federation

Module Federation enables:
- **Independent deployment**: Each micro-frontend can deploy separately
- **Runtime composition**: Applications compose at runtime, not build time
- **Team autonomy**: Different teams can own different remotes
- **Technology diversity**: Mix different bundlers and framework versions
- **Shared dependencies**: Efficient sharing of common libraries

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

**Turborepo:**
- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)

**Module Federation & Zephyr:**
- [Module Federation Documentation](https://module-federation.io/)
- [Rspack Documentation](https://rspack.dev/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
- [Zephyr Cloud Micro-Frontend Guide](https://docs.zephyr-cloud.io/how-to/mf-guide)
