import { Near, type PrivateKey } from 'near-kit'

/**
 * Called by the Vite plugin's `onDeployComplete` hook after the Zephyr agent
 * has uploaded the build and received a deployment URL + snapshot id.
 *
 * Posts the finalization back to the `DeployRegistry` NEAR contract so the
 * on-chain ledger records the deployed URL alongside the manifest hash that
 * authorized it. The caller must equal the `authorize_deploy` signer (the
 * contract checks `pending[manifest_hash] == predecessor`).
 */
export async function registerDeployment(input: {
  snapshotId: string
  url: string
  manifestHash: string
}): Promise<void> {
  const network = process.env.NEAR_NETWORK ?? 'testnet'
  const accountId = process.env.NEAR_ACCOUNT_ID
  const privateKey = process.env.NEAR_PRIVATE_KEY
  const contractId = process.env.DEPLOY_REGISTRY_CONTRACT

  if (!accountId || !privateKey || !contractId) {
    console.warn(
      '[register-deploy] skipping on-chain finalize: missing NEAR_ACCOUNT_ID / NEAR_PRIVATE_KEY / DEPLOY_REGISTRY_CONTRACT',
    )
    return
  }
  if (!input.manifestHash) {
    console.warn('[register-deploy] no manifest hash; nothing to finalize on-chain')
    return
  }

  const near = new Near({
    network: network as 'testnet' | 'mainnet',
    privateKey: privateKey as PrivateKey,
    defaultSignerId: accountId,
  })

  console.log(
    `[register-deploy] recording deploy on ${contractId}: manifest=${input.manifestHash} url=${input.url}`,
  )
  const result = await near
    .transaction(accountId)
    .functionCall(
      contractId,
      'register_deployment',
      {
        manifest_hash: input.manifestHash,
        snapshot_id: input.snapshotId,
        url: input.url,
      },
      { gas: '50 Tgas', attachedDeposit: '0 NEAR' },
    )
    .send({ waitUntil: 'FINAL' })

  console.log(`[register-deploy] finalized on-chain; tx=${result.transaction.hash}`)
}