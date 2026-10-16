---
name: SSR with a Zephyr HTML Shell
slug: server/ssr-html-shell
description: Server-render React on your own Node or Cloudflare server while Zephyr serves the HTML shell and every asset
framework: react
bundler: vite
features: [ssr, edge, typescript]
complexity: beginner
---

# SSR with a Zephyr HTML Shell

> Server-render React on your own Node or Cloudflare server while Zephyr serves the HTML shell and every asset.

## Tech Stack

- React 19 + Vite, deployed to Zephyr Cloud with `vite-plugin-zephyr`
- Fastify for Node and AWS (Docker, ECS), plus a Cloudflare Workers entry, sharing one Fetch API render function
- `react-dom/server` for rendering, `hydrateRoot` in the browser

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/server/ssr-html-shell my-app
cd my-app
pnpm install
pnpm build              # uploads the client to Zephyr, bundles the server
```

The client build prints a Zephyr URL. Put it in `.env` and start the server:

```bash
cp .env.example .env    # then set ZEPHYR_URL
pnpm start              # http://localhost:8080
```

`pnpm dev` runs the plain Vite dev server for working on the UI. `pnpm dev:server` runs the SSR server from source.

## What's Inside

There are two deployments, and each has one job:

```text
browser ──► your SSR server (AWS / Cloudflare / anywhere)
              │  1. GET <ZEPHYR_URL>/  → production index.html (cached 10s)
              │  2. renderToString(<App />) into <div id="root">
              ▼
           HTML with absolute asset URLs
browser ──► Zephyr edge: /assets/*.js, *.css, zephyr-manifest.json
```

The client build uploads to Zephyr as a normal static snapshot. The Zephyr edge then serves a production `index.html` for that deployment: the hashed `<script>` and `<link>` tags Vite wrote, plus an import map Zephyr injects for runtime environment variables. The server treats that file as its template. That means it never needs to know which hashed files a build produced, and it never serves a JavaScript file itself.

Zephyr never runs this server. It hosts the client build, and the server reads what it needs with a plain HTTP request. There is no Zephyr SDK at runtime, so the same approach works from any language or framework that can fetch a URL.

[`server/zephyr-shell.ts`](server/zephyr-shell.ts) holds the three things worth reading:

- **Fetching the shell.** It's one `GET` per Zephyr origin, refreshed every 10 seconds by [`server/stale-cache.ts`](server/stale-cache.ts). See [When Zephyr is unreachable](#when-zephyr-is-unreachable) for what happens when a refresh fails.
- **Absolutizing URLs.** The page comes from your server's origin, but the files live on Zephyr, so root-relative `src`/`href` attributes and import map entries are rewritten to the Zephyr origin. Zephyr serves assets with `Access-Control-Allow-Origin: *`, so cross-origin module scripts just work.
- **Injecting the render.** The markup goes into `<div id="root">`, and the render props go into a JSON script tag. The browser hydrates with the exact same props, which is what keeps hydration mismatch-free.

Two details in the build config matter once assets live on another origin:

- `withZephyr({ snapshotType: 'csr' })` keeps the upload a plain static snapshot. Without it, a Vite SSR output in the same build marks the snapshot as `ssr` and Zephyr tries to render it on its own runtime instead of yours.
- `experimental.renderBuiltUrl` makes URLs emitted inside JS (lazy chunks, imported images) resolve against the script's Zephyr URL instead of the page origin.

The server is built separately, by [`vite.server.config.ts`](vite.server.config.ts), with no Zephyr plugin. It goes to your own infrastructure.

### One render function, two servers

[`server/render.tsx`](server/render.tsx) takes a `URL` and returns a standard `Response`, so it has no idea which server calls it. [`server/worker.ts`](server/worker.ts) hands it the Worker request directly. [`server/fastify.ts`](server/fastify.ts) is the AWS side, and it shows three settings that matter once Fastify runs behind an AWS load balancer:

- **`host: '0.0.0.0'`:** Fastify listens on `localhost` by default, which nothing outside the container can reach.
- **`keepAliveTimeout: 65_000`:** ALBs keep idle connections for 60 seconds. If Node closes them first, the load balancer occasionally sends a request down a dead socket and returns a 502.
- **Copying the `Response` onto `reply` explicitly:** returning a `Response` from the handler works for `GET`, but the `HEAD` route Fastify derives from every `GET` can't handle it and answers 500. Sending status, headers, and the body stream separately works for both.

Every response carries an `x-zephyr-origin` header naming the Zephyr deployment behind it, and the Fastify server logs it with each page. Fastify logs JSON, so after a release, CloudWatch Logs Insights can compare status codes per deployment:

```text
filter msg = "page rendered"
| stats count(*) by zephyr.origin, statusCode
```

### Which URL to use for `ZEPHYR_URL`

Every Zephyr deployment has an immutable **version URL** (the one the build prints). Tags and environments get **mutable URLs** that Zephyr repoints when you release. Point the server at an environment URL, such as production, and it follows releases on its own: the shell refreshes every 10 seconds, so a release reaches the server within seconds, with no server deploy.

That convenience has a cost. The server renders with the components it was built with, while the browser hydrates with whatever the environment currently serves. A release that changes markup can cause hydration mismatches until the server is redeployed. [`ssr-release-pinning`](../ssr-release-pinning) shows how to keep the two in lockstep.

### When Zephyr is unreachable

A Zephyr outage shouldn't become your outage. [`server/stale-cache.ts`](server/stale-cache.ts) applies HTTP's `stale-while-revalidate` and `stale-if-error` rules in memory:

- Once the shell is 10 seconds old, the next request starts one refresh in the background and still gets the cached shell. A warm server never makes a page wait on Zephyr.
- If the refresh fails, the server logs a warning, keeps rendering with the last good shell, and tries again 10 seconds later. Each request to Zephyr times out after 5 seconds, so a hanging connection counts as a failure too.

Two gaps remain. A server that starts during an outage has nothing to fall back to, so it answers 502 until Zephyr is reachable; persisting the last good shell (to disk, Redis, or a copy baked into the image at build time) closes that. And browsers still load the JavaScript and CSS from the edge serving your deployment. If that edge is down too, the server-rendered HTML still arrives, but without styles or interactivity until it recovers.

## Deploy

### AWS (ECS Express Mode)

The Fastify server runs on any container platform. ECS Express Mode creates the load balancer, TLS certificate, and autoscaling for you:

```bash
pnpm build
docker build --platform linux/amd64 -t ssr-html-shell .
# push to ECR, then:
aws ecs create-express-gateway-service \
  --service-name ssr-html-shell \
  --execution-role-arn arn:aws:iam::<account>:role/ecsTaskExecutionRole \
  --infrastructure-role-arn arn:aws:iam::<account>:role/ecsInfrastructureRoleForExpressServices \
  --primary-container '{"image":"<account>.dkr.ecr.<region>.amazonaws.com/ssr-html-shell:latest","containerPort":8080,"environment":[{"name":"ZEPHYR_URL","value":"<your Zephyr URL>"}]}' \
  --health-check-path /healthz \
  --monitor-resources
```

The service URL looks like `https://ssr-html-shell.ecs.<region>.on.aws`. See the [Express Mode guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-getting-started.html) for creating the two IAM roles. The image is a plain Node container, so it runs unchanged on ECS/Fargate, EKS or any other Kubernetes cluster, App Runner, or Google Cloud Run.

### Cloudflare Workers

Set `ZEPHYR_URL` in `wrangler.jsonc`, then:

```bash
pnpm deploy:cloudflare
```

## Learn More

- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
- [React `hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Fastify](https://fastify.dev/docs/latest/)
