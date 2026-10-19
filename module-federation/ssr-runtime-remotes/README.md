---
name: Server-Rendered Federated Remotes with Canary Releases
slug: module-federation/ssr-runtime-remotes
description: Your own Fastify server renders a Module Federation remote it loads from Zephyr at runtime, with canary and preview releases decided per request
framework: react
bundler: rsbuild
features: [module-federation, ssr, typescript]
complexity: advanced
---

# Server-Rendered Federated Remotes with Canary Releases

> Your own Fastify server renders a Module Federation remote it loads from Zephyr at runtime, with canary and preview releases decided per request.

## Tech Stack

- React 19
- `remote/`: Rsbuild 2 with `@module-federation/rsbuild-plugin`, one container built for browsers and for Node.js, deployed with `zephyr-rsbuild-plugin`
- `host/`: a Vite client deployed with `vite-plugin-zephyr`, plus a Fastify server for Node and AWS (Docker, ECS) that loads the remote with `@module-federation/runtime`
- Zephyr's public resolver to pick builds, and the `onDeployComplete` build hook to pin them

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/module-federation/ssr-runtime-remotes my-app
cd my-app
pnpm install
pnpm build    # deploys the remote, then the host client, then bundles the host server
pnpm start    # http://localhost:8080
```

`pnpm dev` runs the remote's dev server and the host UI in the browser, without server rendering.

## What's Inside

The host page renders on your server, and the product card in it comes from a separate team's remote. The two release independently:

- **The host deploys with its server.** As in [`ssr-release-pinning`](../../server/ssr-release-pinning), the host's client build records its own Zephyr version URL, and the server bundle renders into exactly that build.
- **The remote releases through Zephyr.** For every request the server asks Zephyr which remote build to use, loads that build's Node container, and renders it. It then tells the browser the same immutable build to hydrate, so server and browser never run different code. Shipping, canarying, and rolling back the remote never require a server deploy.

Zephyr doesn't run this server. It hosts both builds and answers plain HTTP requests: which build an environment, tag, or version points to, and the files of that build.

```text
browser ──► your Fastify server (AWS / anywhere)
              │  1. cohort from the ze_bucket cookie: stable or candidate
              │  2. the cohort's selector → one immutable remote build (Zephyr resolver)
              │  3. that build's server/mf-manifest.json → ProductCard (loaded once per build)
              │  4. renderToString(<App ProductCard={…} />) into the host's HTML shell
              ▼
           HTML + { remoteOrigin, cohort }
browser ──► Zephyr edge: host JS/CSS, then <remoteOrigin>/mf-manifest.json → hydrateRoot
```

### One remote, two builds

[`remote/rsbuild.config.ts`](remote/rsbuild.config.ts) builds the same container twice using Rsbuild environments: once for browsers, and once for Node.js into `dist/server/`. Each environment gets its own `pluginModuleFederation` instance, the second with `{ target: 'node', environment: 'node' }`. The plugin's `target: 'dual'` shortcut only works in Rslib and Rspress, so a plain Rsbuild app registers the two instances itself. The Node container includes the `@module-federation/node` runtime plugin, which lets it load its own chunks over HTTP from wherever it was served.

`zephyr-rsbuild-plugin` uploads both outputs as one deployment, with the Node build under `/server/`. `snapshotType: 'csr'` keeps it a plain static deployment. Without it, the Node compiler marks the deployment as SSR, and Zephyr would try to run it on its own runtime instead of yours. The `onDeployComplete` hook writes `remote/zephyr-deployment.json`, which tells the host the remote's application id and the build it was built with.

### Picking a build per request

[`host/server/remotes.ts`](host/server/remotes.ts) holds the rollout logic, which lives in your server:

- **Cohorts.** Every visitor gets a bucket from 0 to 99 in a `ze_bucket` cookie. With `CANDIDATE_SELECTOR` set, buckets below `CANDIDATE_PERCENT` get the candidate. The cookie keeps a visitor in the same cohort on every request.
- **Selectors.** `REMOTE_SELECTOR` (stable) and `CANDIDATE_SELECTOR` are anything Zephyr resolves: an environment such as `production`, a tag, a semver range, or `*` for the latest build. Without `REMOTE_SELECTOR`, stable is the build recorded at host build time.
- **Resolution.** Each selector maps to one immutable version URL through Zephyr's public resolver, the same endpoint the bundler plugins use for `zephyr:dependencies`. `url_mode=version` returns the build behind an environment or tag rather than its mutable URL. Answers are refreshed every 15 seconds by [`host/server/stale-cache.ts`](host/server/stale-cache.ts), so a release or rollback in Zephyr reaches the server within seconds, without a restart.
- **Preview.** With `ALLOW_PREVIEW=true`, an `x-zephyr-preview: candidate` header forces the candidate. That lets you test a candidate in production before it gets any traffic, as in a blue-green release.

```text
GET https://api.zephyr-cloud.io/v2/builder-public-api/resolve
    ?name=<remote application_uid>&version=<selector>&url_mode=version
```

The resolver is called from the server on purpose: it doesn't send CORS headers to other origins, and the browser should get one exact build, not a choice to make.

### Loading builds on the server

The server keeps one Module Federation runtime, with the host's React shared as a singleton, so remote components render with the host's copy and hooks work across the boundary. To load a build, it points the `product` remote at that build's `server/mf-manifest.json` with `registerRemotes(..., { force: true })`, then calls `loadRemote('product/ProductCard')`. A build never changes, so each one loads once and every later request reuses the component.

Two runtime details shape that code:

- **Builds load one at a time.** The runtime tracks a remote by its name, so two builds of `product` must not load concurrently. Once loaded, any number of builds render side by side. Every build after the first logs the runtime's "already registered" warning when it loads, which is expected here.
- **Load everything the server renders up front.** A Node container finds its chunks through the build currently registered as `product`. Chunks an exposed module needs load with it, so they always come from the right build. A dynamic `import()` that runs later, after a newer build was registered, would fetch that newer build's chunk. Keep server-rendered remote code free of lazy imports. `renderToString` can't wait for them anyway.

The server runs the code it loads, so it only loads it over HTTPS from hosts in `ALLOWED_REMOTE_HOSTS`, which defaults to the Zephyr edge (`zephyrcloud.app`). Add your own domain if you serve builds from your own cloud.

### Hydrating the same build

The render props travel to the browser in a JSON script tag, as in the other SSR examples, and include `remoteOrigin`. [`host/src/entry-client.tsx`](host/src/entry-client.tsx) creates a browser-side federation runtime for `<remoteOrigin>/mf-manifest.json`, loads `product/ProductCard`, and only then calls `hydrateRoot`. Opened straight from its Zephyr URL, with no server in front, the host renders in the browser with the remote build recorded at build time.

### Releasing

| You want to | Do this | Server change |
| --- | --- | --- |
| Ship a new remote build | Point the stable selector's environment or tag at it in Zephyr | None |
| Canary it | Point a candidate tag at it, then set `CANDIDATE_SELECTOR` and `CANDIDATE_PERCENT` | Environment variables |
| Test it before any traffic | Send `x-zephyr-preview: candidate` with `ALLOW_PREVIEW=true` | Environment variable |
| Roll back | Point the environment or tag back in Zephyr, or set `CANDIDATE_PERCENT=0` | None, or one variable |
| Ship a new host | Deploy the server | New image |

Changing an environment variable restarts the tasks on most platforms, but rebuilds nothing. To move a canary's percentage without a restart, read it from your feature-flag or config service instead.

Every response says which builds produced it, and the Fastify server logs the same values with each page:

```text
x-zephyr-origin: https://<host build>-ze.zephyrcloud.app
x-zephyr-remote-origin: https://<remote build>-ze.zephyrcloud.app
x-zephyr-cohort: stable | candidate
```

Fastify logs JSON, so during a canary CloudWatch Logs Insights can compare status codes per cohort and build:

```text
filter msg = "page rendered"
| stats count(*) by zephyr.cohort, `zephyr.remote-origin`, statusCode
```

### When Zephyr is unreachable

A warm server keeps rendering with the builds it already loaded: the stale-if-error cache holds on to each selector's last good build, and loaded components live in memory. A candidate that can't be resolved or loaded falls back to stable, so a broken release can't take the page down. A server that starts while Zephyr's API is down has no build to fall back to, so it renders the host page without the product card until Zephyr is reachable again. The host's HTML shell and the browser's JavaScript come from the Zephyr edge, and behave as described in [`ssr-html-shell`](../../server/ssr-html-shell#when-zephyr-is-unreachable).

The cohort cookie and the selectors make the HTML differ per visitor, so responses are sent with `cache-control: private, no-store`. If a CDN sits in front of the server, don't let it cache these pages across visitors.

## Deploy

### AWS (ECS Express Mode)

```bash
pnpm build
cd host
docker build --platform linux/amd64 -t ssr-runtime-remotes .
# push to ECR, then:
aws ecs create-express-gateway-service \
  --service-name ssr-runtime-remotes \
  --execution-role-arn arn:aws:iam::<account>:role/ecsTaskExecutionRole \
  --infrastructure-role-arn arn:aws:iam::<account>:role/ecsInfrastructureRoleForExpressServices \
  --primary-container '{"image":"<account>.dkr.ecr.<region>.amazonaws.com/ssr-runtime-remotes:latest","containerPort":8080,"environment":[{"name":"REMOTE_SELECTOR","value":"production"}]}' \
  --health-check-path /healthz \
  --monitor-resources
```

See the [Express Mode guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-getting-started.html) for the two IAM roles. The image is a plain Node container, so it runs unchanged on ECS/Fargate, EKS or any other Kubernetes cluster, App Runner, or Google Cloud Run.

Unlike the SSR examples in [`server/`](../../server), this one has no Cloudflare Workers entry: the federation runtime evaluates the code it downloads, and Workers don't allow evaluating code at runtime.

## Learn More

- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
- [Zephyr environments](https://docs.zephyr-cloud.io/features/environments)
- [Module Federation runtime API: `registerRemotes`](https://module-federation.io/guide/runtime/runtime-api.html#registerremotes)
- [Rsbuild multi-environment builds](https://rsbuild.rs/guide/advanced/environments)
