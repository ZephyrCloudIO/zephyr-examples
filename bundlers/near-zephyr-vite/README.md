---
name: React + NEAR Auth for Zephyr Deploys
slug: bundlers/near-zephyr-vite
description: Zephyr deploys gated by a NEAR account signature via OutLayer TEE, with an on-chain deploy ledger
framework: react
bundler: vite
features: []
complexity: advanced
---

# React + NEAR Auth for Zephyr Deploys

> Zephyr deploys gated by a NEAR account signature via OutLayer TEE, with an
> on-chain deploy ledger. The deploy token never rests on the build machine.

## Why this example

Every Zephyr deploy today is attributed to a git commit via a static
`ZE_SERVER_TOKEN` sitting in a CI secret or `ze login` JWT. This demo shows an
alternative:

- **Access control** — only an on-chain-authorized NEAR account can trigger a
  deploy. The contract (`DeployRegistry`) holds a `LookupSet<AccountId>` of
  deployers and asserts the signer.
- **Billing** — the deployer attaches NEAR (testnet) to fund the OutLayer TEE
  run. Each deploy is provably cost-attributable to a NEAR account on-chain.
- **Token custody** — the `ZE_SERVER_TOKEN` is held inside the OutLayer keystore
  as a `PROTECTED_` CKD secret. Its value is never seen by anyone, including
  the deployer. It is released into the WASM TEE only after the contract
  verifies the caller, then relayed to the build via an on-chain log.
- **Provenance** — every deploy is recorded on the `DeployRegistry` ledger
  with the deployer account, manifest hash, snapshot id, and URL.

## Tech stack
- React + Vite (generic `withZephyr({ hooks: { onDeployComplete } })` plugin)
- near-kit for both cli scripts and the read-only UI
- OutLayer HTTPS/yield-resume TEE (`zephyr-auth-gate` WASM)
- `zephyr-contract` NEAR contract (near-sdk 5.9)

## Architecture

```
pnpm build
  ├─ scripts/near-auth-gate.ts  (prebuild)
  │   └─ near-kit tx → DeployRegistry.authorize_deploy(manifest_hash)  + 0.05 NEAR
  │        require!(authorized.contains(signer))        ← on-chain access control
  │        pending[manifest_hash] = signer
  │        DeployRegistry → outlayer.testnet.request_execution(zephyr-auth-gate)
  │            ┌─ yield ─┐
  │            │   TEE   │  NEAR_SENDER_ID = signer
  │            │  WASM   │  re-check whitelist  (defense in depth)
  │            │         │  std::env::var("ZE_SERVER_TOKEN")   (PROTECTED_ CKD secret)
  │            └─────────┘  stdout { ok, token, manifest_hash, signer }
  │        ▶ on_deploy_authorized callback:
  │            env::log_str("ZE_TOKEN:<token>")
  │            push DeploymentRecord{ authorized: true }
  │   └─ parse receipts → write .zephyr-tmp-token
  │   └─ write .manifest-hash
  └─ vite build
      ├─ vite.config.ts sets process.env.ZE_SERVER_TOKEN from .zephyr-tmp-token
      ├─ zephyr-agent uploads using the gated token
      └─ onDeployComplete → scripts/register-deploy.ts
          └─ near-kit tx → DeployRegistry.register_deployment(url, snapshot_id, manifest_hash)
                on-chain ledger finalizes the record
```

## Prerequisites

1. **A NEAR testnet account** — get one at https://testnet.mynearwallet.com/.
   Save its private key (`ed25519:...`) and account id (`alice.testnet`).
2. **Node + pnpm** — same as the rest of this repo.
3. **Rust toolchain** for the OutLayer WASM + NEAR contract — `rustup install stable`.
   Used only to build/deploy the contract; not needed to run the Vite example.

## Setup

### 1. OutLayer project + secret

1. Push `zephyr-auth-gate/` to a public GitHub repo.
2. Create an OutLayer project on https://outlayer.fastnear.com/ named
   `<your-account>.testnet/zephyr-auth-gate` pointed at that repo.
3. In the OutLayer **Secrets** page, create a `PROTECTED_`-prefixed secret named
   `ZE_SERVER_TOKEN` bound to the project (profile `default`,
   `account_id` = your NEAR account). The CKD wallet generates it inside the
   TEE — its value is never shown to you. *(Alternatively, paste your existing
   Zephyr team-provided `ZE_SERVER_TOKEN` as a manual secret — same env-var
   key, just without the CKD guarantee. Pick `PROTECTED_` for the strongest
   demo.)*

### 2. Build + deploy the WASM gate (if rotating)

```
cd ../../zephyr-auth-gate
cargo build --release --target wasm32-wasip1
# OutLayer will pick this up via the GitHub repo configured in the dashboard
```

### 3. Update the gate whitelist

Edit `../../zephyr-auth-gate/src/main.rs` → `const WHITELIST` to include your
NEAR account, then push so OutLayer recompiles. (Defense-in-depth on top of
the contract's own `authorized_accounts` set.)

### 4. Build + deploy the NEAR contract (one-time)

```
cd ../../zephyr-auth-gate/zephyr-contract
./build.sh      # produces target/near/zephyr_contract.wasm
cd -
cp .env.example .env   # fill in NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY,
                       # OUTLAYER_PROJECT_ID
pnpm install
pnpm deploy:contract
```

`pnpm deploy:contract` uses near-kit to atomically:

- create `zephyr-registry.<your-account>.testnet`
- fund it with 5 NEAR
- deploy `zephyr_contract.wasm`
- call `new(admin = <your-account>, outlayer_project_id, outlayer_secret_owner)`
- call `add_authorized(<your-account>)`

It prints the contract id. Add it to `.env`:

```
DEPLOY_REGISTRY_CONTRACT=zephyr-registry.<your-account>.testnet
```

### 5. Expose the contract id to the UI

The React app needs a `VITE_`-prefixed copy:

```
VITE_DEPLOY_REGISTRY_CONTRACT=zephyr-registry.<your-account>.testnet
VITE_NEAR_NETWORK=testnet
```

## Quick start (build + deploy)

```
pnpm install
pnpm build
```

This runs `prebuild && tsc && vite build`. The prebuild:

1. computes `manifest_hash` from `git HEAD + package name@version` → `.manifest-hash`
2. sends a signed `authorize_deploy` tx with attached NEAR
3. waits for finality, parses `ZE_TOKEN:<token>` from callbacks
4. writes the token to `.zephyr-tmp-token`

Then `vite build` reads the token back and sets `process.env.ZE_SERVER_TOKEN`
for the Zephyr agent upload. On deploy completion, the
`onDeployComplete` hook calls `register_deployment(url, snapshot_id,
manifest_hash)` on the contract.

## Dev mode (UI only)

The UI is a read-only ledger; it surfaces deploys from the chain without
needing a signer:

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
├── manifest.ts           # sha256(git HEAD + pkg name@version)
├── near-auth-gate.ts     # prebuild: NEAR tx → OutLayer → token env
├── register-deploy.ts    # onDeployComplete: NEAR tx → register_deposit
├── deploy-contract.ts    # one-time: factory batch to deploy DeployRegistry
└── parse-logs.ts         # extract ZE_TOKEN:<token> from near-kit receipts
vite.config.ts            # withZephyr({ hooks: { onDeployComplete } })
```

## Learn more
- [OutLayer docs](https://outlayer.fastnear.com/docs)
- [near-kit docs](https://kit.near.tools)
- [Zephyr Cloud docs](https://docs.zephyr-cloud.io)
- Gate WASM — `../../zephyr-auth-gate/`
- NEAR contract — `../../zephyr-auth-gate/zephyr-contract/`

## Roadmap / hardening
- The token transits the contract's on-chain callback log → build env. For
  strongest custody, the next step is to have the OutLayer WASM upload to
  Zephyr directly from inside the TEE so the token never leaves the enclave.
- The OutLayer run is billed in NEAR via the attached deposit on
  `authorize_deploy`. The OutLayer HTTPS API + Payment Key path (USDC stable)
  is an alternative for non-blockchain deploy flows — same gate, different
  settlement.
- The contract's `authorized_accounts` set is admin-gated. For DAO / multi-sig
  gating, wrap `add_authorized` with a vote-threshold policy contract.