# Infrastructure Runbook

Live infrastructure required to run the `near-zephyr-vite` example
end-to-end.

## Architecture

```
Developer                Proxy server (Hono)        NEAR Chain       Zephyr
   │                           │                       │                │
   │ NEP-413 signMessage()     │                       │                │
   │ (off-chain, free)         │                       │                │
   ├── POST /authorize-deploy──►                       │                │
   │  {sig, account, manifest}  │                       │                │
   │                           ├─ verifyNep413Signature│                │
   │                           ├─ is_authorized() ────►│                │
   │                           │◄── true ──────────────┤                │
   │◄─ { zephyrToken } ────────┤                       │                │
   │                           │                       │                │
   │ ZE_SERVER_TOKEN = token   │                       │                │
   │ vite build ──────────────────────────────────────────────────────►
   │                           │                       │                │
   │ register_deployment() ────────────────────────────►                │
   │                           │                 ledger: append          │
```

## 1. NEAR Testnet Account

A funded NEAR testnet account with a full-access key pair.

### Create

https://testnet.mynearwallet.com — create account, export private key.

### Fund

https://near-faucr.io — get testnet NEAR.

### Minimum funding

- ~5 NEAR for contract deployment
- Minimal gas for `register_deployment` calls (~0.001 NEAR each)

### Env

```
NEAR_ACCOUNT_ID=my-deployer.testnet
NEAR_PRIVATE_KEY=ed25519:abcdef...
NEAR_NETWORK=testnet
```

## 2. DeployRegistry Contract

### Build + deploy

```bash
cd zephyr-contract
./build.sh
cd ../bundlers/near-zephyr-vite
pnpm deploy:contract
```

This creates `zephyr-registry.my-deployer.testnet`, deploys the WASM,
calls `new(admin)`, and adds your account as authorized.

Set in `.env`:
```
DEPLOY_REGISTRY_CONTRACT=zephyr-registry.my-deployer.testnet
```

## 3. Hono Proxy Server

The server holds the `ZE_SERVER_TOKEN` and gates it behind NEP-413
signature verification + on-chain authorization check.

### Run

```bash
cd server/near-zephyr-proxy
pnpm install
cp .env.example .env
# Edit: ZE_SERVER_TOKEN, DEPLOY_REGISTRY_CONTRACT
pnpm dev     # http://localhost:3000
```

For production, deploy to Cloudflare Workers, Railway, or any Node.js host.

### Env

```
ZE_SERVER_TOKEN=zephyr_live_...
DEPLOY_REGISTRY_CONTRACT=zephyr-registry.my-deployer.testnet
```

### Security model

- The proxy serves the token over HTTPS only to callers who prove they own
  a NEAR account authorized in the contract
- NEP-413 nonces prevent replay attacks (5-minute TTL enforced by near-kit)
- The token is in the proxy's process memory — standard server security
  applies

## 4. Configure the Build

In `bundlers/near-zephyr-vite/.env`:

```
NEAR_ACCOUNT_ID=my-deployer.testnet
NEAR_PRIVATE_KEY=ed25519:...
NEAR_NETWORK=testnet
DEPLOY_REGISTRY_CONTRACT=zephyr-registry.my-deployer.testnet
ZEPHYR_AUTH_PROXY=http://localhost:3000
```

## Cost Estimate (testnet)

| Operation                   | NEAR cost     |
|-----------------------------|---------------|
| Contract deploy (one-time)  | ~5 NEAR       |
| `register_deployment`       | ~0.001 NEAR   |
| NEP-413 signature           | $0 (off-chain) |

## Troubleshooting

### "proxy rejected deploy: account ... is not authorized"

Your NEAR account is not in the contract's `authorized` set. Call
`add_authorized` from the admin account.

### "invalid NEAR signature"

The proxy couldn't verify the NEP-413 signature. Check:
- The private key in `.env` matches the account
- The account exists on the configured network
- Network clock sync (NEP-413 nonces have a 5-minute TTL)

### "contract not reachable"

The proxy can't reach the contract. Check:
- `DEPLOY_REGISTRY_CONTRACT` is correctly set
- Network is correct (`testnet` vs `mainnet`)
- RPC endpoint is accessible

### "missing env: set NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY, ZEPHYR_AUTH_PROXY"

Copy `.env.example` to `.env` and fill in all values. The proxy URL must
point to a running `near-zephyr-proxy` instance.
