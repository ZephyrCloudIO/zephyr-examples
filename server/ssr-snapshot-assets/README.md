---
name: Streaming SSR from Zephyr Snapshot Assets
slug: server/ssr-snapshot-assets
description: Stream React SSR on your own server using the asset list and Vite manifest Zephyr's edge exposes for every snapshot
framework: react
bundler: vite
features: [ssr, edge, typescript]
complexity: advanced
---

# Streaming SSR from Zephyr Snapshot Assets

> Stream React SSR on your own server using the asset list and Vite manifest Zephyr's edge exposes for every snapshot.

## Tech Stack

- React 19 + Vite, deployed to Zephyr Cloud with `vite-plugin-zephyr`
- `renderToReadableStream` with `bootstrapModules` and `importMap`
- Fastify for Node and AWS (Docker, ECS), plus a Cloudflare Workers entry, sharing one Fetch API render function

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/server/ssr-snapshot-assets my-app
cd my-app
pnpm install
pnpm build              # uploads the client to Zephyr, bundles the server
cp .env.example .env    # set ZEPHYR_URL to the URL the build printed
pnpm start              # http://localhost:8080
```

## What's Inside

[`ssr-html-shell`](../ssr-html-shell) borrows the `index.html` Zephyr serves. This example goes one level lower: React renders and streams the whole document, and the server works out which hashed files belong in it by querying the Zephyr edge directly. Every Zephyr URL, whether a version, tag, or environment, answers the same public read-only endpoints:

| Endpoint | Returns |
| --- | --- |
| `/__get_version_info__` | The snapshot a URL currently serves and that snapshot's immutable version hostname |
| `/__get_zephyr_snapshot__` | The application id and every uploaded file, with hash and size |
| `/.vite/manifest.json` | Vite's map from entry to hashed JS and CSS (requires `build.manifest: true`) |
| `/zephyr-manifest.json` | Zephyr runtime environment variables and resolved remotes |

They're plain HTTP and JSON. Zephyr never runs this server, and nothing here needs a Zephyr SDK at runtime, so the same approach works from any language.

[`server/zephyr-build.ts`](server/zephyr-build.ts) chains them with two caching rules, and that split is the main idea here:

- **What is live is mutable.** An environment URL serves a different snapshot after every release or rollback, so `__get_version_info__` is re-checked every 10 seconds. If Zephyr can't be reached, [`server/stale-cache.ts`](server/stale-cache.ts) keeps the last good build rendering, as described in [When Zephyr is unreachable](../ssr-html-shell#when-zephyr-is-unreachable).
- **A snapshot is immutable.** Its asset list and Vite manifest never change, so they're fetched once from the snapshot's own version URL and cached by snapshot id.

As a result, each page points at one exact snapshot. Even when a release lands mid-request, the entry script, its CSS, and its preloads all come from the same build. The response says which one:

```text
x-zephyr-snapshot: <snapshot id>
```

The Fastify server logs the same value with every page, so errors can be grouped by snapshot after a release:

```text
filter msg = "page rendered"
| stats count(*) by zephyr.snapshot, statusCode
```

[`server/render.tsx`](server/render.tsx) hands the result to React. `bootstrapModules` adds the entry script, and `importMap` maps `env:vars:<application_uid>` to the requested URL's `zephyr-manifest.json`. That gives the browser the same runtime environment variables as a page Zephyr serves itself. It deliberately uses the requested URL rather than the version URL, because Zephyr stores environment variables per environment. React places the import map ahead of the module preloads it emits, which is the order browsers require. The same `renderToReadableStream` call runs on Node and on Workers.

Like `ssr-html-shell`, this server renders with the components it was built with. Combine it with the build pinning from [`ssr-release-pinning`](../ssr-release-pinning) if releases and server deploys can drift apart.

## Deploy

### AWS (ECS Express Mode)

```bash
pnpm build
docker build --platform linux/amd64 -t ssr-snapshot-assets .
# push to ECR, then:
aws ecs create-express-gateway-service \
  --service-name ssr-snapshot-assets \
  --execution-role-arn arn:aws:iam::<account>:role/ecsTaskExecutionRole \
  --infrastructure-role-arn arn:aws:iam::<account>:role/ecsInfrastructureRoleForExpressServices \
  --primary-container '{"image":"<account>.dkr.ecr.<region>.amazonaws.com/ssr-snapshot-assets:latest","containerPort":8080,"environment":[{"name":"ZEPHYR_URL","value":"<your Zephyr URL>"}]}' \
  --health-check-path /healthz \
  --monitor-resources
```

See the [Express Mode guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-getting-started.html) for the two IAM roles. The image is a plain Node container, so it runs unchanged on ECS/Fargate, EKS or any other Kubernetes cluster, App Runner, or Google Cloud Run.

### Cloudflare Workers

Set `ZEPHYR_URL` in `wrangler.jsonc`, then:

```bash
pnpm deploy:cloudflare
```

## Learn More

- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
- [React `renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream)
- [Vite backend integration and `build.manifest`](https://vite.dev/guide/backend-integration)
