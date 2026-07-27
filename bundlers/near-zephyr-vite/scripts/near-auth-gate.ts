import { Near, type PrivateKey } from 'near-kit'
import { writeFileSync } from 'node:fs'
import { computeManifestHash, manifestHashFile } from './manifest'
import { parseZephyrToken } from './parse-logs'

/**
 * Prebuild step. Before `vite build`:
 *   1. compute the manifest hash
 *   2. fire a `authorize_deploy` NEAR transaction signed by the deployer
 *      account (this transaction pays for the OutLayer run via the attached
 *      deposit attached at the contract)
 *   3. the contract cross-calls OutLayer to execute the `zephyr-auth-gate`
 *      WASM in the TEE, which verifies the caller + releases the
 *      `ZE_SERVER_TOKEN` secret
 *   4. the contract's callback emits `ZE_TOKEN:<token>` as an on-chain log
 *   5. we parse that log out of the receipts and set
 *      `process.env.ZE_SERVER_TOKEN`, which gates the zephyr-agent upload
 *   6. we persist `.manifest-hash` so vite.config.ts can read it back during
 *      `onDeployComplete` (matching the authorization with the registered
 *      deploy)
 *
 * If the account is unsigned/unauthorized, or the gate rejects, the script
 * exits 1 and the build aborts. This is the access control + billing demo.
 */
async function main() {
  const network = process.env.NEAR_NETWORK ?? 'testnet'
  const accountId = process.env.NEAR_ACCOUNT_ID
  const privateKey = process.env.NEAR_PRIVATE_KEY
  const contractId = process.env.DEPLOY_REGISTRY_CONTRACT

  if (!accountId || !privateKey || !contractId) {
    console.error(
      'missing env: set NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY, DEPLOY_REGISTRY_CONTRACT (see .env.example)',
    )
    process.exit(1)
  }

  const manifestHash = computeManifestHash()
  // Persist so vite.config.ts can read it back at onDeployComplete time.
  writeFileSync(manifestHashFile(), manifestHash, 'utf8')
  console.log(`[near-auth-gate] manifest_hash=${manifestHash}`)

  const near = new Near({
    network: network as 'testnet' | 'mainnet',
    privateKey: privateKey as PrivateKey,
    defaultSignerId: accountId,
  })

  console.log(`[near-auth-gate] sending authorize_deploy on ${contractId} as ${accountId}…`)
  const result = await near
    .transaction(accountId)
    .functionCall(
      contractId,
      'authorize_deploy',
      { manifest_hash: manifestHash },
      { gas: '250 Tgas', attachedDeposit: '0.05 NEAR' },
    )
    .send({ waitUntil: 'FINAL' })

  const parsed = parseZephyrToken(result.receipts_outcome)

  if (parsed.failures.length > 0) {
    console.error('[near-auth-gate] gate rejected the deploy:', parsed.failures.join('; '))
    process.exit(1)
  }

  if (!parsed.token) {
    // No ZE_TOKEN in any callback log — either the contract is misconfigured,
    // or the OutLayer run failed mid-flow.
    console.error(
      '[near-auth-gate] no ZE_TOKEN in receipts — deploy not authorized. tx',
      result.transaction.hash,
    )
    console.error(
      'logs:',
      result.receipts_outcome.flatMap((r) => r.outcome.logs).join('\n  '),
    )
    process.exit(1)
  }

  // Critical: this is what gates zephyr-agent's upload in the subsequent vite build.
  process.env.ZE_SERVER_TOKEN = parsed.token
  /**
   * NOTE: process.env doesn't survive across separate Node.js processes. Since
   * we are already in the same `pnpm build` chain (prebuild → vite build in
   * the same parent if chained with `&`), but pnpm executes each script as a
   * separate node invocation, we need to expose the token differently.
   *
   * We use a small `.zephyr-tmp-token` file that vite.config.ts reads back at
   * set-env-time. This is the same pattern as `.manifest-hash`.
   */
  writeFileSync(
    manifestHashFile().replace('.manifest-hash', '.zephyr-tmp-token'),
    parsed.token,
    'utf8',
  )
  console.log(
    `[near-auth-gate] deploy authorized; ZE_SERVER_TOKEN sourced from OutLayer TEE + DeployRegistry callback. tx=${result.transaction.hash}`,
  )
}

main().catch((err) => {
  console.error('[near-auth-gate] failed:', err)
  process.exit(1)
})