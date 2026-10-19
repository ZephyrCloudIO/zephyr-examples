---
name: SSR Release Pinning
slug: server/ssr-release-pinning
description: Let Zephyr environments and tags pick the live client build while your SSR server only renders the build it matches
framework: react
bundler: vite
features: [ssr, edge, typescript]
complexity: intermediate
---

# SSR Release Pinning

> Let Zephyr environments and tags pick the live client build while your SSR server only renders the build it matches.

## Tech Stack

- React 19 + Vite, deployed to Zephyr Cloud with `vite-plugin-zephyr`
- Zephyr's `onDeployComplete` build hook and public dependency resolver
- Fastify for Node and AWS (Docker, ECS), plus a Cloudflare Workers entry, sharing one Fetch API render function

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/server/ssr-release-pinning my-app
cd my-app
pnpm install
pnpm build    # deploys the client to Zephyr, then bundles the server against it
pnpm start    # http://localhost:8080
```

No URL to copy this time: the server already knows which Zephyr build it belongs to.

## What's Inside

This builds on [`ssr-html-shell`](../ssr-html-shell), which renders into the HTML shell Zephyr serves. That example leaves one problem open. The server renders with the components it was built with, while the browser hydrates with whatever client build Zephyr currently serves. Once those differ, React throws away the server markup or, worse, attaches handlers to the wrong elements.

As in that example, Zephyr never runs the server. It hosts the client builds and decides which one is live, and the server asks it over plain HTTP, with no Zephyr SDK at runtime. This example solves the skew problem in three steps.

**1. The client build records itself.** In [`vite.config.ts`](vite.config.ts), `withZephyr({ hooks: { onDeployComplete } })` runs once the upload finishes. It receives the build's immutable version URL and writes it to `server/zephyr-deployment.json`. `pnpm build` runs the client build first, so the server bundle is built with that file inside it. Every server artifact therefore knows exactly which client build its markup matches.

**2. Zephyr picks the release.** With `ZEPHYR_SELECTOR` unset, the server always uses its own build. That's lockstep mode: deploying the server is the release. Set `ZEPHYR_SELECTOR=production` (or a tag name, a semver range, or `*` for latest) and [`server/release.ts`](server/release.ts) asks Zephyr instead:

```text
GET https://api.zephyr-cloud.io/v2/builder-public-api/resolve
    ?name=<application_uid>&version=production&url_mode=version
```

This public endpoint is the same one the bundler plugins use for `zephyr:dependencies`. `url_mode=version` returns the immutable version URL behind the environment, rather than the environment's own mutable URL, so the result can be compared to the pinned build. The answer is refreshed every 15 seconds by [`server/stale-cache.ts`](server/stale-cache.ts). If the API can't be reached, the server keeps serving the last build it resolved, and the HTML shell is cached the same way, as described in [When Zephyr is unreachable](../ssr-html-shell#when-zephyr-is-unreachable).

**3. The server renders only what it matches.** When the resolved build is the pinned one, the page is server-rendered as usual. When Zephyr has moved on, for example right after a release or rollback and before the server redeploys, the server returns the shell untouched and the browser renders it. Users get a working page from the new release immediately, and server rendering resumes once a matching server is deployed. Every response says which path it took:

```text
x-zephyr-origin: https://<version>-ze.zephyrcloud.app
x-zephyr-render: ssr | csr
```

The Fastify server also logs both values with every page, so you can compare error rates between releases, or between server-rendered and client-rendered pages:

```text
filter msg = "page rendered"
| stats count(*) by zephyr.origin, zephyr.render, statusCode
```

Setting `ZEPHYR_ALLOW_OVERRIDE=true` lets `?zephyr=<tag>` preview any tag or environment through the same server. That's handy for QA on a staging deployment.

The comparison is deliberately strict: it uses whole builds, not markup. Two builds from identical source still count as different, which costs a client render but never a broken hydration.

## Deploy

### AWS (ECS Express Mode)

```bash
pnpm build
docker build --platform linux/amd64 -t ssr-release-pinning .
# push to ECR, then:
aws ecs create-express-gateway-service \
  --service-name ssr-release-pinning \
  --execution-role-arn arn:aws:iam::<account>:role/ecsTaskExecutionRole \
  --infrastructure-role-arn arn:aws:iam::<account>:role/ecsInfrastructureRoleForExpressServices \
  --primary-container '{"image":"<account>.dkr.ecr.<region>.amazonaws.com/ssr-release-pinning:latest","containerPort":8080,"environment":[{"name":"ZEPHYR_SELECTOR","value":"production"}]}' \
  --health-check-path /healthz \
  --monitor-resources
```

In CI, run `pnpm build` and the image build in the same job, so the image always contains the deployment record of the client build it shipped with. See the [Express Mode guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-getting-started.html) for the two IAM roles. The image is a plain Node container, so it runs unchanged on ECS/Fargate, EKS or any other Kubernetes cluster, App Runner, or Google Cloud Run.

### Cloudflare Workers

Set `ZEPHYR_SELECTOR` in `wrangler.jsonc` if you want Zephyr to pick the release, then:

```bash
pnpm build
pnpm deploy:cloudflare
```

## Learn More

- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
- [Zephyr environments](https://docs.zephyr-cloud.io/features/environments)
- [React `hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)
