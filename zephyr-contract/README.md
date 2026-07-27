# zephyr-contract

NEAR contract — `DeployRegistry` — that gates Zephyr deploys by whitelisted
NEAR accounts and keeps an on-chain provenance ledger of every deploy.
Pairs with the `near-zephyr-proxy` Hono server and the
`bundlers/near-zephyr-vite` example.

## What it does

1. **Access control.** `authorized: LookupSet<AccountId>` — admin adds NEAR
   accounts that may deploy. The proxy server checks `is_authorized(accountId)`
   before issuing a Zephyr token.
2. **Provenance.** `register_deployment(manifest_hash, snapshot_id, url)` —
   called by the build's `onDeployComplete` hook — appends a
   `DeploymentRecord` to the on-chain ledger. Each record captures the
   deployer, git manifest, Zephyr URL, snapshot id, and timestamp.
3. **Auditability.** `get_deployments(from_index?, limit?)` and
   `get_deployments_count()` are public view methods. Any NEAR explorer or
   dapp can read the full history.

## Build

```bash
./build.sh
# target/near/zephyr_contract.wasm
```

Requires `cargo-near`:

```bash
cargo install cargo-near
```

## Deploy (one-time)

```bash
# Via the example helper:
pnpm --filter near-zephyr-vite deploy:contract
```

That helper runs `scripts/deploy-contract.ts`, which atomically creates a
subaccount, funds it, deploys the WASM, and calls `new(admin)` + `add_authorized`.

## Methods

### `new(admin)` `[init]`

Initialize the contract. `admin` is the only account that can call
`add_authorized` and `remove_authorized`.

### `add_authorized(account)` / `remove_authorized(account)` — admin

Manage the deployer allow-list.

### `is_authorized(account) -> bool` (view)

Checked by the `near-zephyr-proxy` server before issuing a deploy token.

### `get_deployments(from_index?, limit?) -> Vec<DeploymentRecord>` (view)

Append-only deploy ledger.

### `get_deployments_count() -> u64` (view)

### `register_deployment(manifest_hash, snapshot_id, url)`

Finalizes a deploy. Caller must be in the `authorized` set. Pushes a new
`DeploymentRecord`.

## Usage

Authorize a deployer (admin):

```bash
near call zephyr-registry.alice.testnet add_authorized \
  '{"account":"alice.testnet"}' --accountId alice.testnet
```

Read the ledger:

```bash
near view zephyr-registry.alice.testnet get_deployments '{"limit":50}'
```

## Architecture

```
Developer                    Proxy server                Contract
   │                              │                         │
   │ NEP-413 signMessage          │                         │
   ├── POST /authorize-deploy ──►│                         │
   │                              ├─ verifyNep413Signature()
   │                              ├─ is_authorized() ──────►│
   │                              │◄─ true ─────────────────┤
   │◄── { zephyrToken } ─────────┤                         │
   │                              │                         │
   │ vite build + Zephyr upload   │                         │
   │                              │                         │
   ├── register_deployment() ──────────────────────────────►│
   │                              │       ledger: append    │
```

## DeploymentRecord

```rust
pub struct DeploymentRecord {
    pub deployer: AccountId,
    pub manifest_hash: String,
    pub url: Option<String>,
    pub snapshot_id: Option<String>,
    pub timestamp: u64,
}
```
