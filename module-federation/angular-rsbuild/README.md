---
name: Angular + Rsbuild Module Federation
slug: module-federation/angular-rsbuild
description: Angular micro-frontends using Rsbuild Module Federation, deployed with Zephyr Cloud
framework: angular
bundler: rsbuild
features: [module-federation, typescript]
complexity: intermediate
---

# Angular + Rsbuild Module Federation

> Angular micro-frontends using Rsbuild Module Federation, deployed with Zephyr Cloud.

## Tech Stack

- Angular 20
- Rsbuild 1
- Rspack-powered Angular compilation through `@nx/angular-rsbuild`
- Module Federation through `@module-federation/rsbuild-plugin`
- Zephyr Cloud through `zephyr-rsbuild-plugin`
- TypeScript

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/module-federation/angular-rsbuild my-app
cd my-app
pnpm install
pnpm dev
```

## What's Inside

- `remote/` exposes `PromoCardComponent` as `angular_rsbuild_remote/PromoCard`
- `host/` imports the remote component at runtime and renders it with `NgComponentOutlet`
- Both apps use standalone Angular components, zoneless change detection, Rsbuild, and Module Federation
- Rsbuild runs the Module Federation plugin and the Zephyr plugin as separate plugins
- The host declares `zephyr:dependencies` so Zephyr can resolve `angular_rsbuild_remote` during deployment

Angular 20 is used because the current Angular Rsbuild adapters support Angular `>=19 <21`.

Development ports:

- Host: `http://localhost:4200`
- Remote: `http://localhost:4201`
- Remote manifest: `http://localhost:4201/mf-manifest.json`

## Deploy

```bash
pnpm build
```

`pnpm build` builds the remote first, then the host. Zephyr Cloud deploys during each Rsbuild production build when `ZE_SERVER_TOKEN` is configured.

## Learn More

- [Angular Documentation](https://angular.dev)
- [Rsbuild Documentation](https://rsbuild.rs)
- [Rspack Documentation](https://rspack.dev)
- [Module Federation Documentation](https://module-federation.io)
- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
