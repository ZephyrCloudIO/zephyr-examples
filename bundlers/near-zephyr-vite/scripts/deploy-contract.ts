import { Near, generateKey, type PrivateKey } from 'near-kit'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * One-time deploy of the `DeployRegistry` NEAR contract to a subaccount of
 * `NEAR_ACCOUNT_ID` (e.g. `zephyr-registry.alice.testnet`).
 *
 *   cd ../../zephyr-contract
 *   ./build.sh
 *   # then back here:
 *   pnpm deploy:contract
 *
 * Atomically: creates the subaccount, funds it, deploys the WASM, calls
 * `new(admin)`, and `add_authorized(<your account>)`.
 *
 * After deploy, set `DEPLOY_REGISTRY_CONTRACT` in .env to the printed
 * account id (e.g. `zephyr-registry.alice.testnet`).
 */

const ZEPHYR_CONTRACT_PATH = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'zephyr-contract',
  'target',
  'near',
  'zephyr_contract.wasm',
)

async function main() {
  const network = process.env.NEAR_NETWORK ?? 'testnet'
  const accountId = process.env.NEAR_ACCOUNT_ID
  const privateKey = process.env.NEAR_PRIVATE_KEY

  if (!accountId || !privateKey) {
    console.error('missing env: set NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY (see .env.example)')
    process.exit(1)
  }

  let wasm: Buffer
  try {
    wasm = readFileSync(ZEPHYR_CONTRACT_PATH)
  } catch {
    console.error(
      `[deploy-contract] ${ZEPHYR_CONTRACT_PATH} not found.\n` +
        'Build it first:\n' +
        '  cd ../../zephyr-contract\n' +
        '  ./build.sh',
    )
    process.exit(1)
  }

  const subaccountId = `zephyr-registry.${accountId}`

  const near = new Near({
    network: network as 'testnet' | 'mainnet',
    privateKey: privateKey as PrivateKey,
    defaultSignerId: accountId,
  })

  console.log(`[deploy-contract] creating + funding + deploying ${subaccountId}…`)
  const result = await near
    .transaction(accountId)
    .createAccount(subaccountId)
    .transfer(subaccountId, '5 NEAR')
    .addKey(generateKey().publicKey.toString(), { type: 'fullAccess' })
    .deployContract(subaccountId, new Uint8Array(wasm))
    .functionCall(subaccountId, 'new', { admin: accountId })
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
