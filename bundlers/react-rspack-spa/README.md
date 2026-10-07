---
name: React + Rspack SPA fallback
slug: bundlers/react-rspack-spa
description: BrowserRouter nested routes to reproduce Zephyr preview refresh 404s without HashRouter
framework: react
bundler: rspack
features: [typescript]
complexity: beginner
---

# React + Rspack SPA fallback

> BrowserRouter nested routes to reproduce Zephyr preview refresh 404s without HashRouter.

This is the isolated repro for Trade Hub / SGWS: `BrowserRouter`, no basename, no hash. Local `historyApiFallback` works. Nested refresh on the Zephyr preview host currently 404s.

## Tech Stack

- React 19
- React Router `BrowserRouter`
- Rspack
- `zephyr-rspack-plugin`

## Routes

- `/`
- `/suppliers`
- `/suppliers/:supplierId`

## Quick Start

```bash
npx degit ZephyrCloudIO/zephyr-examples/bundlers/react-rspack-spa my-app
cd my-app
pnpm install
pnpm dev
```

Local check (should all return the app HTML):

1. Open http://localhost:8080/
2. Click **Suppliers** (client nav works)
3. Refresh http://localhost:8080/suppliers (dev server rewrites to `index.html`)

## Deploy

```bash
pnpm build
```

`pnpm build` deploys to Zephyr Cloud and prints a preview URL.

## How to reproduce the bug

On the printed `*.zephyr-cloud.io` / `*.ze.southernglazers.com` URL:

1. Open `/` — expect 200 HTML
2. Click **Suppliers** — page renders, address bar is `/suppliers` with no `#`
3. Refresh `/suppliers` or paste `/suppliers/1` in a new tab — currently empty 404
4. After the edge fix, those same URLs return the app `index.html` (200)

```bash
# Replace with the URL printed by pnpm build
URL=https://<preview-host>

curl -sS -D - -o /dev/null -H 'Accept: text/html' "$URL/"
curl -sS -D - -o /dev/null -H 'Accept: text/html' "$URL/suppliers"
curl -sS -D - -o /dev/null -H 'Accept: text/html' "$URL/suppliers/1"
```

**Broken today:** `/` is 200 with `x-server: zephyr-cloud`. `/suppliers` is 404 `text/plain`, empty body, no `x-server`.

**Fixed:** `/suppliers` and `/suppliers/1` return the same HTML as `/`. JS/CSS still 404 if the file is missing.

## What this is not

- Not HashRouter
- Not a hardcoded React Router `basename`
- Not a Fastly `employee-*` prefix map (`/ncc/accounts`, `/auth/login`)

## Learn More

- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
