# Zephyr Cloud Examples

This repository contains projects demonstrating how to deploy applications to Zephyr Cloud.
A selection of bundlers, frameworks, and patterns are used.

Each example project comes with Zephyr Cloud enabled.
Once you've forked this repository, you can clone it and follow the instructions to [build and deploy](#deploying-an-example-project) to your Zephyr Cloud account.

## Repository Structure

This repository is organized into three independent directories, each with its own build system:

### 📁 `/vanilla` - pnpm Workspaces
Simple examples without any monorepo build system. Uses pnpm workspaces for dependency management.

**Examples:**
- `angular-vite` - Angular application with Vite
- `basehref-examples` - Base href examples
- `create-default-webpack-mf` - React with Module Federation and Webpack
- `create-mf-app-rspack` - React with Rspack
- `ember-vite` - Ember with Vite
- `modernjs-app` - ModernJS app with React and Rspack
- `ng-mf` - Angular with Module Federation
- `parcel-react` - Parcel and React application
- `plugin-testing` - Plugin testing examples
- `qwik-1.5` - Qwik application
- `react-airbnb-clone` - AirBnb clone with React, Module Federation and Rspack
- `react-rollup-ts` - React with Rollup
- `react-rspack-tractor-2.0` - React with Rspack
- `react-tractor-sample` - React with Webpack
- `react-vite-mf` - React with Vite and Module Federation
- `react-vite-ts` - React with TypeScript and Vite
- `rolldown-react` - React with Rolldown
- `rspack-project` - Simple Rspack with React
- `rspress-ssg` - Rspress SSG
- `solid` - SolidJS application
- `svelte` - Svelte application
- `tsdown` - TypeScript bundler example
- `vitepress` - VitePress documentation

### 📁 `/nx` - NX Monorepo
Examples built with NX monorepo system.

**Examples:**
- `create-nx-workspace-mf` - NX with React, Module Federation, and Webpack
- `create-nx-rspack-workspace-mf` - NX with React, Module Federation, and Rspack
- `react-vite-nx` - NX with React and Vite
- `nx-ng` - NX with Angular v15 and Webpack

### 📁 `/turborepo` - Turborepo
Examples built with Turborepo monorepo system.

**Examples:**
- `turbo-rspack-mf` - Turborepo with React and Rspack

## Working with Examples

Each directory (`vanilla`, `nx`, `turborepo`) is **completely independent** and has its own:
- `package.json` - Dependency management
- `pnpm-workspace.yaml` - Workspace configuration with shared catalogs
- `examples/` - Example projects

### Using Just (Recommended)

This repository includes a `Justfile` for convenient management. Install [just](https://github.com/casey/just) and run:

```shell
# See all available commands
just

# Install dependencies in all directories
just install-all

# Install in a specific directory
just install-vanilla
just install-nx
just install-turborepo

# Build a specific example
just build-vanilla react-vite-ts
just build-nx create-nx-workspace-mf
just build-turborepo turbo-rspack-mf

# List all examples
just list-all

# Clean everything
just clean-all

# Full reset (clean + reinstall)
just reset-all
```

### Getting Started with a Specific Directory

1. **Navigate to the directory you want to work with:**
   ```shell
   cd vanilla  # or cd nx, or cd turborepo
   ```

2. **Install dependencies:**
   ```shell
   pnpm install
   ```

3. **Navigate to an example:**
   ```shell
   cd examples/react-vite-ts  # or any other example
   ```

4. **Build the project:**
   ```shell
   pnpm build
   ```

After you build the project, it will be deployed to your Zephyr Cloud account.

## Important Notes

- **No root-level dependencies**: The root of this repository has no `package.json`, `pnpm-workspace.yaml`, or build system. Each directory is completely self-contained.
- **Independent workspaces**: Each directory (`vanilla`, `nx`, `turborepo`) can be worked on independently without affecting the others.
- **Shared catalogs**: Each directory maintains its own pnpm catalog for consistent dependency versions across its examples.

## Documentation

For more information on using Zephyr Cloud, visit the [official documentation](https://docs.zephyr-cloud.io).

## Contributors

![Alt](https://repobeats.axiom.co/api/embed/9d3af925eba49c0dd8ddd8ee144443242fba9b6a.svg "Repobeats analytics image")

## TODO

- [ ] Remove `@rspack/plugin-minify` in favor of `terser-webpack-plugin`
- [x] Move to consistent build command
- [ ] Create testing matrix that can run with every canary of plugins
