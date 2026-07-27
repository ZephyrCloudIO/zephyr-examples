# zephyr-contract

NEAR contract — `DeployRegistry` — that gates Zephyr deploys by NEAR account,
calls OutLayer to release a `ZE_SERVER_TOKEN`, and keeps an on-chain ledger of
every deploy. Pairs with the `zephyr-auth-gate` WASM and the
`bundlers/near-zephyr-vite` example.

## What it does

1. **Access control.** `authorized: LookupSet<AccountId>` — admin adds NEAR
   accounts that may deploy.
2. **Billing.** `authorize_deploy` is `#[payable]` — attached NEAR funds the
   OutLayer run. Refund (unused NEAR) goes back to the deployer via
   `payer_account_id`.
3. **TEE gate.** `authorize_deploy` cross-calls OutLayer's
   `request_execution` for the `zephyr-auth-gate` project, passing
   `secrets_ref` so the gate's `ZE_SERVER_TOKEN` secret is decrypted in the
   TEE. OutLayer yields/resumes → `on_deploy_authorized` callback.
4. **Token relay.** The callback parses the gate JSON, logs `ZE_TOKEN:<token>`
   (or `ZE_TOKEN_FAIL:<reason>`), and pushes a `DeploymentRecord` to the
   ledger — authorized or not, so unauthorized attempts are auditable on-chain.
5. **Provenance.** `register_deployment(manifest_hash, snapshot_id, url)` —
   called by the build's `onDeployComplete` hook after the Zephyr upload —
   records the deployed URL/snapshot for the matching pending authorization.

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

Pick a subaccount of your testnet NEAR account (here `zephyr-registry.alice.testnet`):

```bash
near account create-account fund-my-account alice.testnet \
  use-manifest-path ../../bundlers/near-zephyr-vite/scripts/deploy-contract.ts
# or, via the example helper:
pnpm --filter near-zephyr-vite deploy:contract
```

That helper runs the Vite example's `scripts/deploy-contract.ts`, which uses
near-kit to create the subaccount, fund it, deploy the WASM, and call
`new(admin, outlayer_project_id, outlayer_secret_owner)` atomically.

## Methods

### `new(admin, outlayer_project_id?, outlayer_secret_owner?)` `[init]`

Initialize.

### `add_authorized(account)` / `remove_authorized(account)` — admin

Manage the deployer allow-list.

### `set_outlayer_config(outlayer_project_id, outlayer_secret_owner)` — admin

Rotate the OutLayer project id or secret-owner NEAR account.

### `is_authorized(account) -> bool` (view)

### `get_deployments(from_index?, limit?) -> Vec<DeploymentRecord>` (view)

Append-only deploy ledger.

### `get_deployments_count() -> u64` (view)

### `authorize_deploy(manifest_hash) -> Promise` — `#[payable]` ≥ 0.01 NEAR

The gate. Caller must be authorized. Internally calls OutLayer.

### `register_deployment(manifest_hash, snapshot_id, url)`

Finalize. Caller must equal the `authorize_deploy` caller for that
`manifest_hash`.

### `on_deploy_authorized(manifest_hash, #[callback_result] result)` — `#[private]`

OutLayer callback. Emits `ZE_TOKEN:<token>` or `ZE_TOKEN_FAIL:<reason>` and
appends the ledger record.

## Usage

Authorize the deployer (admin):

```bash
near call zephyr-registry.alice.testnet add_authorized \
  '{"account":"alice.testnet"}' --accountId alice.testnet
```

Build + gated deploy (run from `bundlers/near-zephyr-vite/`):

```bash
pnpm build    # runs near-auth-gate (authorize_deploy) then vite build
```

The `authorize_deploy` log stream (visible in any NEAR explorer):

```
zephyr-deploy-request: deployer=alice.testnet manifest_hash=abc123…
ZE_TOKEN:zephyr_live_xxxxxxxxxxxxxxxxxxxx
```

Finalize:

```bash
# (also fired automatically by onDeployComplete in vite.config.ts)
near call zephyr-registry.alice.testnet register_deployment \
  '{"manifest_hash":"abc123…","snapshot_id":"snap_…","url":"https://….zephyr.app"}' \
  --accountId alice.testnet
```

Read the ledger:

```bash
near view zephyr-registry.alice.testnet get_deployments '{"limit":50}'
```

## Architecture

```
User (build) ──► authorize_deploy(manifest_hash) + 0.01 NEAR
   │            require!(authorized.contains(signer))
   │            pending[manifest_hash] = signer
   ▼
DeployRegistry ─► outlayer.testnet.request_execution(
   │              source = Project("alice.testnet/zephyr-auth-gate"),
   │              input_data = { manifest_hash },
   │              secrets_ref = { profile:"default", account_id: secret_owner })
   │   ⏸️ YIELD
   ▼
OutLayer TEE: signer = NEAR_SENDER_ID; whitelist check; ZE_SERVER_TOKEN secret
   ▶️ RESUME
   ▼
on_deploy_authorized(manifest_hash, result)
   │  log!("ZE_TOKEN:<token>")
   └─ push DeploymentRecord{ authorized: true, … }
       (build greps the log from receipts → process.env.ZE_SERVER_TOKEN)

After vite build:
register_deployment(manifest_hash, snapshot_id, url)
   └─fills url+snapshot_id on the matching record
```

## Notes

- The contract **does not** hold the `ZE_SERVER_TOKEN` anywhere — it's a secret
  bound to the OutLayer gate project and injected only into the WASM TEE.
- Logs are public on-chain. The token is relayed via log purely for the
  testnet demo (the production hardening is "OutLayer does the upload itself
  inside the TEE" — see `bundlers/near-zephyr-vite/README.md` → Roadmap).