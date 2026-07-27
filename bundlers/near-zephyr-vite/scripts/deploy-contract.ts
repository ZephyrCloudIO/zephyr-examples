import { Near, generateKey, type PrivateKey } from 'near-kit'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * One-time deploy of the `zephyr-contract` NEAR contract (DeployRegistry) to a
 * subaccount of `NEAR_ACCOUNT_ID` (e.g. `zephyr-registry.alice.testnet`).
 *
 * Run via `pnpm deploy:contract`. Expects you to have already built the WASM:
 *   cd ../../zephyr-auth-gate/zephyr-contract
 *   ./build.sh
 *
 * The script atomically: creates the subaccount, funds it, deploys the WASM
 * (factory batch — either succeeds or rolls back), then calls `new(admin,
 * outlayer_project_id, outlayer_secret_owner)` to initialize, and finally
 * `add_authorized(<your account>)` so the first deploy is unblocked.
 *
 * After deploy, set `DEPLOY_REGISTRY_CONTRACT` in .env to the printed account
 * id (e.g. `zephyr-registry.alice.testnet`).
 */

const ZEPHYR_CONTRACT_PATH = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'zephyr-auth-gate',
  'zephyr-contract',
  'target',
  'near',
  'zephyr_contract.wasm',
)

async function main() {
  const network = process.env.NEAR_NETWORK ?? 'testnet'
  const accountId = process.env.NEAR_ACCOUNT_ID
  const privateKey = process.env.NEAR_PRIVATE_KEY
  const outlayerProjectId = process.env.OUTLAYER_PROJECT_ID
  const outlayerSecretOwner = process.env.OUTLAYER_SECRET_OWNER ?? accountId

  if (!accountId || !privateKey || !outlayerProjectId || !outlayerSecretOwner) {
    console.error(
      'missing env: set NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY, OUTLAYER_PROJECT_ID (see .env.example)',
    )
    process.exit(1)
  }

  let wasm: Buffer
  try {
    wasm = readFileSync(ZEPHYR_CONTRACT_PATH)
  } catch {
    console.error(
      `[deploy-contract] ${ZEPHYR_CONTRACT_PATH} not found.\n` +
        'Build it first:\n' +
        '  cd ../../zephyr-auth-gate/zephyr-contract\n' +
        '  ./build.sh',
    )
    process.exit(1)
  }

  // Deterministic subaccount id — only the parent NEAR account can create it.
  const subaccountId = `zephyr-registry.${accountId}`

  const near = new Near({
    network: network as 'testnet' | 'mainnet',
    privateKey: privateKey as PrivateKey,
    defaultSignerId: accountId,
  })

  console.log(`[deploy-contract] creating + funding + deploying ${subaccountId}…`)
  // Atomic factory batch: create, fund, add a full-access key (so we can
  // re-init if needed), deploy, initialize, self-authorize.
  const result = await near
    .transaction(accountId)
    .createAccount(subaccountId)
    .transfer(subaccountId, '5 NEAR')
    .addKey(generateKey().publicKey.toString(), { type: 'fullAccess' })
    .deployContract(subaccountId, new Uint8Array(wasm))
    .functionCall(subaccountId, 'new', {
      admin: accountId,
      outlayer_project_id: outlayerProjectId,
      outlayer_secret_owner: outlayerSecretOwner,
    })
    .functionCall(subaccountId, 'add_authorized', { account: accountId })
    .send({ waitUntil: 'FINAL' })

  console.log(`[deploy-contract] done, tx=${result.transaction.hash}`)
  console.log(`  DEPLOY_REGISTRY_CONTRACT=${subaccountId}`)
  console.log(
    'Add this line to your .env file:\n' +
      `  DEPLOY_REGISTRY_CONTRACT=${subaccountId}`,
  )
}

main().catch((err) => {
  console.error('[deploy-contract] failed:', err)
  process.exit(1)
})