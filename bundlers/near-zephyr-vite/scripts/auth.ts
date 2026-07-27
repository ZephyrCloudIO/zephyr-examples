import { Near, generateNonce, type PrivateKey } from 'near-kit'
import { writeFileSync } from 'node:fs'
import { computeManifestHash, manifestHashFile } from './manifest'

/**
 * Prebuild step. Before `vite build`:
 *   1. compute the manifest hash
 *   2. sign the deploy request with the developer's NEAR private key
 *      (NEP-413 off-chain signature — FREE, no gas, no transaction)
 *   3. POST the signed message to the Zephyr Auth Proxy server
 *   4. the proxy verifies the signature + checks contract.is_authorized()
 *   5. on success the proxy returns a ZE_SERVER_TOKEN
 *   6. we persist the token so vite.config.ts can inject it into the build
 *
 * If the account is not authorized (or the signature is invalid), the
 * proxy returns 4xx and the script exits 1 — build aborts.
 */
async function main() {
  const network = (process.env.NEAR_NETWORK ?? 'testnet') as 'testnet' | 'mainnet'
  const accountId = process.env.NEAR_ACCOUNT_ID
  const privateKey = process.env.NEAR_PRIVATE_KEY
  const proxyUrl = process.env.ZEPHYR_AUTH_PROXY

  if (!accountId || !privateKey || !proxyUrl) {
    console.error(
      'missing env: set NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY, ZEPHYR_AUTH_PROXY (see .env.example)',
    )
    process.exit(1)
  }

  const manifestHash = computeManifestHash()
  writeFileSync(manifestHashFile(), manifestHash, 'utf8')
  console.log(`[auth] manifest_hash=${manifestHash}`)

  const near = new Near({
    network,
    privateKey: privateKey as PrivateKey,
    defaultSignerId: accountId,
  })

  const nonce = generateNonce()
  const message = `authorize-deploy:${manifestHash}`
  const recipient = 'zephyr.near'

  console.log(`[auth] signing NEP-413 message as ${accountId}…`)
  const signedMessage = await near.signMessage({ message, recipient, nonce })

  console.log(`[auth] requesting token from ${proxyUrl}…`)
  const res = await fetch(`${proxyUrl}/api/authorize-deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signedMessage,
      message,
      recipient,
      nonce: Buffer.from(nonce).toString('hex'),
    }),
  })

  const body = (await res.json()) as { ok: boolean; zephyrToken?: string; error?: string }
  if (!res.ok || !body.ok) {
    console.error(`[auth] proxy rejected deploy: ${body.error ?? `HTTP ${res.status}`}`)
    process.exit(1)
  }

  const tokenPath = manifestHashFile().replace('.manifest-hash', '.zephyr-tmp-token')
  writeFileSync(tokenPath, body.zephyrToken!, 'utf8')

  console.log(`[auth] deploy authorized for ${accountId} — token issued by proxy`)
}

main().catch((err) => {
  console.error('[auth] failed:', err)
  process.exit(1)
})
