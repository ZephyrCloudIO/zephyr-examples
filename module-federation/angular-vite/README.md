---
name: Angular + Vite Module Federation
slug: module-federation/angular-vite
description: Angular micro-frontends using Vite Module Federation, deployed with Zephyr Cloud
framework: angular
bundler: vite
features: [module-federation, typescript]
complexity: intermediate
---

# Angular + Vite Module Federation

> Angular micro-frontends using Vite Module Federation, deployed with Zephyr Cloud.

## Tech Stack

- Angular 21
- Vite 8
- Angular zoneless change detection
- `@analogjs/vite-plugin-angular`
- `@module-federation/vite` through `vite-plugin-zephyr`
- TypeScript

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/module-federation/angular-vite my-app
cd my-app
pnpm install
pnpm dev
```

## What's Inside

- `remote/` exposes `PromoCardComponent` as `angular_remote/PromoCard`
- `host/` imports the remote component at runtime and renders it with `NgComponentOutlet`
- Both apps use Vite, standalone Angular components, zoneless change detection, and shared Module Federation config
- Vite runs `@module-federation/vite` directly and `vite-plugin-zephyr` alongside it
- The host declares `zephyr:dependencies` so Zephyr can resolve `angular_remote` during deployment

## Why Analog's Vite Plugin?

Angular's official `application` builder is the default for new Angular apps and uses Vite for the development server. The Vite layer is encapsulated by the Angular CLI and cannot be directly configured, so it cannot receive `@module-federation/vite` plugins.

Angular's custom build pipeline docs call out tightly-coupled Module Federation as a niche reason to use a custom pipeline, and list the AnalogJS Vite plugin as the supported community option for building Angular through Vite directly.

Development ports:

- Host: `http://localhost:5173`
- Remote: `http://localhost:5174`
- Remote entry: `http://localhost:5174/remoteEntry.js`

## Deploy

```bash
pnpm build
```

`pnpm build` builds the remote first, then the host. Zephyr Cloud deploys during each Vite build when `ZE_SERVER_TOKEN` is configured.

## Learn More

- [Angular Documentation](https://angular.dev)
- [Angular application build system](https://angular.dev/tools/cli/build-system-migration)
- [Angular custom build pipeline](https://angular.dev/ecosystem/custom-build-pipeline)
- [Vite Documentation](https://vite.dev)
- [Module Federation Documentation](https://module-federation.io)
- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
