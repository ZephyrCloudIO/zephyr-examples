---
name: NEAR Zephyr Auth Proxy
slug: server/near-zephyr-proxy
description: Hono proxy that verifies NEP-413 NEAR signatures and gates Zephyr deploy tokens behind on-chain authorization
framework: nitro
bundler: nitro
features: []
complexity: advanced
---

# Near Zephyr Proxy

Hono server that verifies [NEP-413](https://github.com/near/NEPs/blob/master/neps/nep-0413)
NEAR account signatures and gates Zephyr Cloud deploy tokens behind on-chain authorization.

## How it works

1. A developer signs a deploy request with their NEAR private key (off-chain, free)
2. They POST the signed message to `POST /api/authorize-deploy`
3. The server verifies the cryptographic signature (NEP-413)
4. The server checks the `DeployRegistry` contract: `is_authorized(accountId)`
5. If both pass, the server returns a Zephyr `ZE_SERVER_TOKEN`

The token never leaves the server other than through the HTTPS response to
the authenticated developer.

## Setup

```bash
pnpm install
cp .env.example .env
# Edit .env: set ZE_SERVER_TOKEN, DEPLOY_REGISTRY_CONTRACT
```

## Run

```bash
pnpm dev     # http://localhost:3000
pnpm start   # production
```

## Deployment targets

The server is a standard Hono app. It works on:

| Platform        | Command                           |
|-----------------|-----------------------------------|
| Node.js         | `node --import tsx src/index.ts` |
| Bun             | `bun src/index.ts`               |
| Deno            | `deno run src/index.ts`          |
| Cloudflare Workers | `wrangler deploy`             |

## API

### `POST /api/authorize-deploy`

Request body:
```json
{
  "signedMessage": {
    "accountId": "alice.testnet",
    "publicKey": "ed25519:...",
    "signature": "..."
  },
  "message": "authorize-deploy:sha256...",
  "recipient": "zephyr.near",
  "nonce": "hex encoded 64-byte nonce"
}
```

Success response (200):
```json
{
  "ok": true,
  "zephyrToken": "zephyr_live_...",
  "accountId": "alice.testnet"
}
```

Error responses:
- 400 — missing or invalid request body
- 401 — invalid NEAR signature
- 403 — account not in the contract's authorized set
- 502 — contract not reachable (check `DEPLOY_REGISTRY_CONTRACT`)
