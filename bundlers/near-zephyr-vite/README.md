---
name: React + NEAR Auth for Zephyr Deploys
slug: bundlers/near-zephyr-vite
description: Zephyr deploys gated by a NEAR account signature, with an on-chain deploy provenance ledger
framework: react
bundler: vite
features: []
complexity: advanced
---

# React + NEAR Auth for Zephyr Deploys

> Zephyr deploys authorized by a NEAR account signature — replacing static API
> tokens with cryptographic proof of who you are on-chain.

## Why this example

Every Zephyr deploy today is attributed to a git commit via a static
`ZE_SERVER_TOKEN` stored in CI secrets or a `ze login` JWT. This demo shows
an alternative:

- **Access control** — only NEAR accounts authorized in the on-chain
  `DeployRegistry` contract can deploy. No shared tokens, no .env secrets on
  CI machines.
- **Per-deploy billing** — each deploy requires a NEAR account in the
  authorized set. Billing can be added on top (e.g. attach NEAR to
  `register_deployment`).
- **Token custody** — the `ZE_SERVER_TOKEN` lives on the
  `near-zephyr-proxy` server, never on developer machines. The server
  releases it only after verifying a NEP-413 off-chain signature.
- **Provenance** — every deploy is recorded on-chain with the deployer
  account, manifest hash, snapshot id, and URL. Fully auditable.

## Tech stack
- React + Vite (`withZephyr({ hooks: { onDeployComplete } })`)
- near-kit for NEP-413 signatures, contract calls, and read-only UI
- Hono proxy server (`near-zephyr-proxy`) that verifies NEAR signatures
  and gates the deploy token
- `zephyr-contract` NEAR contract (near-sdk 5.9) with authorized accounts
  and a deploy ledger

## Architecture

```
pnpm build
  ├─ scripts/auth.ts  (prebuild)
  │   ├─ near-kit signMessage — NEP-413 off-chain signature (FREE, no gas)
  │   ├─ POST /api/authorize-deploy → near-zephyr-proxy
  │   │     verifyNep413Signature()
  │   │     contract.is_authorized(accountId)?
  │   │     → { zephyrToken: "zephyr_live_..." }
  │   └─ write .zephyr-tmp-token + .manifest-hash
  │
  └─ vite build
      ├─ vite.config.ts sets process.env.ZE_SERVER_TOKEN from .zephyr-tmp-token
      ├─ zephyr-agent uploads using the gated token
      └─ onDeployComplete → scripts/register-deploy.ts
          └─ near-kit tx → DeployRegistry.register_deployment(url, snapshot_id, manifest_hash)
                on-chain ledger records the deploy
```

## Prerequisites

1. **A NEAR testnet account** — get one at https://testnet.mynearwallet.com/.
   Save its private key (`ed25519:...`) and account id (`alice.testnet`).
2. **Node + pnpm** — same as the rest of this repo.
3. **Rust toolchain** to build the contract — `rustup install stable`.
   Only needed for the one-time contract deploy, not to run the example.
4. **A running `near-zephyr-proxy`** — see `../../server/near-zephyr-proxy/`.

## Setup

### 1. Deploy the proxy server

```bash
cd ../../server/near-zephyr-proxy
pnpm install
cp .env.example .env
# Edit .env: set ZE_SERVER_TOKEN, DEPLOY_REGISTRY_CONTRACT
pnpm dev       # http://localhost:3000
```

### 2. Build + deploy the NEAR contract (one-time)

```bash
cd ../../zephyr-contract
./build.sh      # produces target/near/zephyr_contract.wasm
cd -
cp .env.example .env    # fill in NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY
pnpm install
pnpm deploy:contract
```

`pnpm deploy:contract` atomically:
- creates `zephyr-registry.<your-account>.testnet`
- funds it with 5 NEAR
- deploys `zephyr_contract.wasm`
- calls `new(admin=<your-account>)`
- calls `add_authorized(<your-account>)`

Add the printed contract id to `.env`:
```
DEPLOY_REGISTRY_CONTRACT=zephyr-registry.<your-account>.testnet
```

### 3. Expose the contract id to the UI

The React app needs `VITE_`-prefixed copies:
```
VITE_DEPLOY_REGISTRY_CONTRACT=zephyr-registry.<your-account>.testnet
VITE_NEAR_NETWORK=testnet
```

## Quick start (build + deploy)

```
pnpm install
pnpm build
```

The prebuild (`scripts/auth.ts`):

1. computes `manifest_hash` from git HEAD + package name@version
2. signs a NEP-413 off-chain message with the deployer's NEAR key (free)
3. POSTs the signed message to the proxy server
4. the proxy verifies the signature + checks `contract.is_authorized()`
5. the proxy returns a `ZE_SERVER_TOKEN`
6. the token is written to `.zephyr-tmp-token`

Then `vite build` reads the token and passes it to the Zephyr agent.
On deploy completion, `onDeployComplete` calls
`register_deployment(url, snapshot_id, manifest_hash)` on the contract.

## Dev mode (UI only)

The UI is a read-only deploy ledger; it surfaces records from the chain
without needing a signer:

```
pnpm dev
```

## What's inside

```
src/
├── App.tsx               # deploy ledger table + flow diagram
├── main.tsx
├── styles.css
├── vite-env.d.ts
└── near/
    ├── client.ts         # Read-only Near instance + account explorer URLs
    └── registry.ts       # getDeployments(), DeploymentRecord type
scripts/
├── auth.ts               # prebuild: NEP-413 sign → proxy → token
├── manifest.ts           # sha256(git HEAD + pkg name@version)
├── register-deploy.ts    # onDeployComplete: NEAR tx → register_deployment
└── deploy-contract.ts    # one-time: factory batch to deploy DeployRegistry
vite.config.ts            # withZephyr({ hooks: { onDeployComplete } })
tests/
└── unit.test.ts          # manifest hash + parse-log unit tests
```

## Learn more
- [near-kit docs](https://kit.near.tools)
- [NEP-413 specification](https://github.com/near/NEPs/blob/master/neps/nep-0413.md)
- [Zephyr Cloud docs](https://docs.zephyr-cloud.io)
- Proxy server — `../../server/near-zephyr-proxy/`
- NEAR contract — `../../zephyr-contract/`
