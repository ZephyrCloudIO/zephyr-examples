# Infrastructure Runbook

This document describes the live infrastructure required to run the
`near-zephyr-vite` example end-to-end. The example is fully buildable
without any of this, but the actual deploy + token-release flow requires
three external services.

## Architecture Overview

```
┌─────────────┐     authorize_deploy      ┌─────────────────────┐
│  Developer  │──────────────────────────▶│  DeployRegistry     │
│  (build)    │                           │  (NEAR contract)    │
└─────────────┘                           └────────┬────────────┘
      │                                             │ cross_call
      │                                             ▼
      │                                    ┌─────────────────────┐
      │                                    │  OutLayer TEE       │
      │                                    │  (zephyr-auth-gate  │
      │                                    │   WASM)             │
      │                                    └────────┬────────────┘
      │                                             │ release secret
      │                                             ▼
      │  ZE_TOKEN:<token>  ◀──── callback ──────── logs
      │
      │  process.env.ZE_SERVER_TOKEN
      ▼
┌─────────────┐
│  Vite Build  │──▶ Zephyr Cloud (deploy with released token)
│  + Zephyr    │
└─────────────┘
      │
      │ onDeployComplete
      ▼
  register_deployment (NEAR tx #2) ──▶ on-chain provenance ledger
```

## 1. NEAR Testnet Account

You need a funded NEAR testnet account with a full-access key pair.

### Create

```bash
# Option A: Use NEAR Wallet UI
# https://testnet.nearwallet.com — create account, then export private key

# Option B: Use near-kit CLI (if available)
npx near-kit create-account my-deployer.testnet --network testnet
```

### Fund

Get testnet NEAR from the faucet: https://near-faucr.io (testnet)

You need at least:
- ~5 NEAR for contract deployment (create subaccount + storage)
- ~0.1 NEAR per `authorize_deploy` call (attached deposit for OutLayer run)
- ~0.01 NEAR per `register_deployment` call (gas only)

### Export Key

In `.env`:
```
NEAR_ACCOUNT_ID=my-deployer.testnet
NEAR_PRIVATE_KEY=ed25519:abcdef...
NEAR_NETWORK=testnet
```

## 2. DeployRegistry NEAR Contract

### Build

```bash
cd zephyr-auth-gate/zephyr-contract
cargo near build non-reproducible-wasm
```

### Deploy (one-time)

The `deploy:contract` script handles subaccount creation, funding, WASM
deployment, and contract initialization:

```bash
cd bundlers/near-zephyr-vite
pnpm deploy:contract
```

This will:
1. Create a subaccount (e.g. `registry.my-deployer.testnet`)
2. Transfer 5 NEAR for storage
3. Deploy the contract WASM
4. Call `new()` with your account as admin
5. Call `add_authorized()` to whitelist your deployer account

Output: the contract account ID goes in `.env` as
`DEPLOY_REGISTRY_CONTRACT`.

### Verify

```bash
# View the on-chain ledger
npx near-kit view <contract-id> get_deployments --network testnet
```

## 3. OutLayer TEE Project

OutLayer provides Trusted Execution Environment (TEE) compute on NEAR.
The `zephyr-auth-gate` WASM runs inside OutLayer's TEE, where it can
read protected secrets that are never visible to anyone — not even the
contract admin.

### Create Project

1. Go to https://outlayer.testnet (or mainnet) dashboard
2. Create a new project named `zephyr-auth-gate`
3. Upload the compiled gate WASM:

```bash
cd zephyr-auth-gate
cargo build --target wasm32-wasip1 --release
# Upload target/wasm32-wasip1/release/zephyr_auth_gate.wasm
```

Alternatively, point OutLayer at a public GitHub repo containing the
WASM.

### Store Protected Secret

On the OutLayer project dashboard:

1. Navigate to "Secrets" → "Protected" (prefix `PROTECTED_`)
2. Add `PROTECTED_ZE_SERVER_TOKEN` with your Zephyr server token value
3. The value is sealed inside the TEE — it is never readable by anyone
   outside the TEE execution context

### Whitelist Authorized Accounts

The gate WASM contains a hardcoded `WHITELIST` array in `src/main.rs`:

```rust
const WHITELIST: &[&str] = &[
    "my-deployer.testnet",
];
```

Rebuild and re-upload the WASM if you change the whitelist.

## 4. Zephyr Cloud Account

1. Sign up at https://zephyr-cloud.io
2. Complete a deploy (any example) to generate a `ZE_SERVER_TOKEN`
3. Copy the token value — this is what you store as `PROTECTED_ZE_SERVER_TOKEN`
   in OutLayer

### How the Token Gets Used

During `pnpm build`:

1. `prebuild` sends `authorize_deploy` to the NEAR contract
2. The contract calls OutLayer, which runs the gate WASM in the TEE
3. The gate verifies the caller is whitelisted, reads
   `PROTECTED_ZE_SERVER_TOKEN`, and logs it
4. The contract callback emits `ZE_TOKEN:<token>` as an on-chain log
5. The build script parses that log and sets
   `process.env.ZE_SERVER_TOKEN`
6. Vite + Zephyr uses that token to authenticate the deploy upload

The token is never stored on disk or in a `.env` file. It is only alive
for the duration of the build process.

## Environment Variables Summary

| Variable                     | Where set       | Purpose                              |
|------------------------------|-----------------|--------------------------------------|
| `NEAR_ACCOUNT_ID`            | `.env`          | Deployer NEAR account                 |
| `NEAR_PRIVATE_KEY`           | `.env`          | Full-access key for signing txs      |
| `NEAR_NETWORK`               | `.env`          | `testnet` or `mainnet`               |
| `DEPLOY_REGISTRY_CONTRACT`  | `.env`          | Contract account ID                  |
| `PROTECTED_ZE_SERVER_TOKEN`  | OutLayer dashboard | Sealed Zephyr token (never in `.env`) |
| `NEAR_SENDER_ID`             | Injected by OutLayer | Originating tx signer (gate reads) |

## Cost Estimate (testnet)

| Operation                   | NEAR cost   |
|-----------------------------|-------------|
| Contract deploy (one-time)  | ~5 NEAR     |
| `authorize_deploy` per build| ~0.1 NEAR   |
| `register_deployment`       | ~0.01 NEAR  |

## Troubleshooting

### "ZE_TOKEN_FAIL: account not authorized"

Your NEAR account is not in the contract's `authorized` set. Call
`add_authorized` from the admin account, or update the gate WASM
whitelist.

### "ZE_TOKEN_FAIL: OutLayer returned no result"

OutLayer did not return any output. Check:
- The gate WASM is uploaded and valid
- `PROTECTED_ZE_SERVER_TOKEN` is set on the OutLayer dashboard
- The OutLayer project is active and funded

### "Could not load ZE_SECRET_TOKEN" (Zephyr)

The token was not released — check `prebuild` output for `ZE_TOKEN:`
logs. If the prebuild failed, `.zephyr-tmp-token` won't exist and the
build script aborts with a clear message.

### "missing env: set NEAR_ACCOUNT_ID..."

Copy `.env.example` to `.env` and fill in the values described above.