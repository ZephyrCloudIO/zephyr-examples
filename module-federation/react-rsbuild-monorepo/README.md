---
name: React + Rsbuild Module Federation Monorepo
slug: module-federation/react-rsbuild-monorepo
description: Verified React monorepo with an Rsbuild host, two federated remotes, Zephyr dependencies, DTS diagnostics, and browser tests
framework: react
bundler: rsbuild
features: [module-federation, monorepo, typescript]
complexity: advanced
---

# React + Rsbuild Module Federation Monorepo

> A verified React monorepo with an Rsbuild host, two federated remotes,
> Zephyr dependencies, DTS diagnostics, watch-mode checks, and browser tests.

## Tech Stack

- React 19
- Rsbuild
- Module Federation
- pnpm workspaces
- Zephyr Cloud
- Playwright

## Architecture

The example contains three independently buildable applications:

- `apps/header` exposes `header/Header`;
- `apps/hero` exposes `hero/Hero`;
- `apps/host` consumes both remotes and declares the matching
  `zephyr:dependencies`.

The build runs the remotes before the host. The committed verification scripts
check declared, locked, installed, generated, and browser-observed state. The
`diagnostics/type-001` project preserves a reproducible DTS `TS6059` failure and
its expected diagnostic path.

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/module-federation/react-rsbuild-monorepo my-app
cd my-app
pnpm install --frozen-lockfile
pnpm dev
```

The local development and verification commands set
`ZEPHYR_EXAMPLE_OFFLINE=1`, which disables publishing while preserving the
Rsbuild and Module Federation configuration.

## Verify

```bash
pnpm verify:scaffold
pnpm verify
pnpm verify:browser
```

These checks verify the official scaffold and integration commands, package
pins, remote-first build order, federation manifests, exposed modules, web
watch behavior, DTS diagnostics, browser rendering, and a remote-only update.

## Deploy

Provide an authorized Zephyr credential, then build:

```bash
pnpm build
```

The build publishes `header`, then `hero`, then `host`.

## Learn More

- [Rsbuild + React Module Federation monorepo guide](https://docs.zephyr-cloud.io/tutorials/rsbuild-react-mf-monorepo)
- [Zephyr Cloud documentation](https://docs.zephyr-cloud.io)
- [Module Federation documentation](https://module-federation.io)
