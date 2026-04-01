---
name: Nitro Hello World
slug: server/nitro-hello-world
description: Minimal Nitro server with Zephyr Cloud deployment
framework: nitro
bundler: nitro
features: [edge]
complexity: beginner
---

# Nitro Hello World

Minimal Nitro server with the web-standard `fetch` handler. Based on the upstream Nitro `hello-world` example and adapted for Zephyr Cloud with Nitro's built-in `zephyr` preset and a `src/` server layout.

## Stack

- Nitro
- Vite + `nitro/vite`
- Zephyr Cloud via Nitro preset

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Start the dev server
   ```bash
   pnpm dev
   ```
3. Build and deploy to Zephyr Cloud
   ```bash
   pnpm build
   ```
4. Preview the production output locally
   ```bash
   pnpm preview
   ```

## Zephyr Cloud

`nitro.config.ts` enables the `zephyr` preset and sets `zephyr.deployOnBuild` to `true`, so `pnpm build` both builds and deploys the app.

The server entry lives in `src/server.ts` and Nitro is pointed there with `serverEntry: "./src/server.ts"`.

For non-interactive deploys, set `ZE_SECRET_TOKEN` in your shell or CI environment before running the build.

## Upstream Source

- [Nitro hello-world example](https://github.com/nitrojs/nitro/tree/main/examples/hello-world)
- [Nitro Zephyr provider docs](https://github.com/nitrojs/nitro/blob/main/docs/2.deploy/20.providers/zephyr.md)
