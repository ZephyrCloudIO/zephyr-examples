---
name: TanStack Router + Rsbuild Module Federation
slug: module-federation/tanstack-router-rsbuild
description: Type-safe TanStack Router host lazy-loading federated route components with Rsbuild, deployed with Zephyr Cloud
framework: tanstack
bundler: rsbuild
features: [module-federation, typescript]
complexity: intermediate
---

# TanStack Router + Rsbuild Module Federation

> Type-safe TanStack Router host lazy-loading federated route components with Rsbuild, deployed with Zephyr Cloud.

## Tech Stack

- React 19
- TanStack Router (code-based routes)
- Rsbuild 2 / Rspack 2
- Module Federation through `@module-federation/rsbuild-plugin`
- Zephyr Cloud through `zephyr-rsbuild-plugin`
- TypeScript

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/module-federation/tanstack-router-rsbuild my-app
cd my-app
pnpm install
pnpm dev
```

## What's Inside

- `host/` owns the TanStack Router route tree and registers it for end-to-end type safety
- `catalog/` is a remote that exposes `ProductList` and `ProductDetail` as `catalog/ProductList` and `catalog/ProductDetail`
- The host mounts the remote components with `lazyRouteComponent`, so the remote is only fetched when `/products` is first visited (or preloaded on link hover)
- `/products/$productId` reads the typed param in the host and passes it to the remote as a prop, keeping the route contract on the host side
- `@tanstack/react-router` is shared as a singleton, so `<Link>` inside the remote resolves against the host's router context. Without the singleton, the remote would get its own copy of the router and fail with a missing `RouterProvider`
- The catalog also runs standalone with its own router (hash history), mirroring the same paths so its links work in both places
- The host declares `zephyr:dependencies`, so Zephyr resolves `catalog` to the deployed remote at build time

This example has its own `pnpm-workspace.yaml` and lockfile because it uses Rsbuild 2 while other examples in this repo are still on Rsbuild 1.

Development ports:

- Host: `http://localhost:3000`
- Catalog remote: `http://localhost:3001`
- Remote manifest: `http://localhost:3001/mf-manifest.json`

## Deploy

```bash
pnpm build    # Builds and deploys to Zephyr Cloud
```

`pnpm build` builds the catalog first, then the host, so the host can resolve the freshly deployed remote.

## Learn More

- [TanStack Router Documentation](https://tanstack.com/router)
- [Rsbuild Documentation](https://rsbuild.rs)
- [Module Federation Documentation](https://module-federation.io)
- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
