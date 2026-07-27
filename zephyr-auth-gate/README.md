# zephyr-auth-gate (OutLayer WASM)

> OutLayer TEE gate that releases a Zephyr `ZE_SERVER_TOKEN` to an authorized
> NEAR account. Pairs with the `zephyr-contract` NEAR contract and the
> `bundlers/near-zephyr-vite` Zephyr example.

## What it proves

1. **No static deploy secret on the build machine.** `ZE_SERVER_TOKEN` lives
   only inside the OutLayer TEE keystore, encrypted via CKD. The build never
   holds it in a `.env` or CI secret — it is *summoned* at deploy time.
2. **NEAR account attribution.** The chain vouches for the caller
   (`NEAR_SENDER_ID`, injected by OutLayer). The WASM only enforces policy,
   it does **not** re-verify an ed25519 signature — that work is done by the
   NEAR validator set.
3. **On-chain billing.** The contract's `authorize_deploy` is `#[payable]`;
   attached NEAR funds the OutLayer run. Each deploy is cost-attributable to a
   NEAR account, on-chain.

## Input

```json
{ "manifest_hash": "<sha256 of git HEAD + package name + version>" }
```

## Output

```json
{ "ok": true, "token": "<ZE_SERVER_TOKEN>", "manifest_hash": "...", "signer": "alice.testnet" }
```

On failure returns `{ "ok": false, "error": "...", "manifest_hash": "...", "signer": "..." }`.

## Build

```bash
rustup target add wasm32-wasip1
cargo build --release --target wasm32-wasip1
# target/wasm32-wasip1/release/zephyr_auth_gate.wasm
```

Test locally:

```bash
echo '{"manifest_hash":"deadbeef"}' | wasmtime target/wasm32-wasip1/release/zephyr_auth_gate.wasm
# {"ok":false,"error":"ZE_SERVER_TOKEN secret missing ...","manifest_hash":"deadbeef","signer":""}
```

## Configure the whitelist

Edit `const WHITELIST` in `src/main.rs` and add the NEAR testnet account that
will run deploys. (In production, move this list into OutLayer worker storage
via `storage::set_worker("whitelist", ...)` so it can be rotated without
recompiling.)

## OutLayer project + secret setup

1. Push this folder to a public GitHub repo (OutLayer clones & compiles it).
2. On the [OutLayer dashboard](https://outlayer.fastnear.com/) create a project
   (e.g. `<your-account>.testnet/zephyr-auth-gate`) and point it at your repo.
3. On the **Secrets** page, create a `PROTECTED_`-prefixed secret named
   `ZE_SERVER_TOKEN`. The `PROTECTED_` prefix proves it was generated inside
   the TEE via Confidential Key Derivation — nobody, including you, can read
   its value. Bind the secret to your project with profile `default` and
   `account_id` = your NEAR account.
4. Record the project id — it's used by the `zephyr-contract` and the Vite
   example (`OUTLAYER_PROJECT_ID` env var).

> Note: if your Zephyr `ZE_SERVER_TOKEN` is provided by the Zephyr team (a
> string you must paste), create it as a *manual* secret instead, with the same
> name and project binding. The CKD/`PROTECTED_` flow is the stronger demo, but
> either works — the WASM only reads `std::env::var("ZE_SERVER_TOKEN")`.

## How it slots into the deploy flow

```
pnpm build
  ├─ scripts/near-auth-gate.ts
  │   └─ near-kit tx → zephyr-contract.authorize_deploy(manifest_hash)
  │       └─ DeployRegistry → outlayer.request_execution(zephyr-auth-gate)
  │           └─ TEE: verify signer, read ZE_SERVER_TOKEN secret
  │       └─ callback logs "ZE_TOKEN:<token>"
  │   └─ parse receipts → process.env.ZE_SERVER_TOKEN = token
  └─ vite build (zephyr-agent uploads using the token)
      └─ onDeployComplete → register_deployment(snapshot_id, url, manifest_hash)
```

See `../zephyr-contract/README.md` for the NEAR contract side and
`../../bundlers/near-zephyr-vite/README.md` for the end-to-end example.