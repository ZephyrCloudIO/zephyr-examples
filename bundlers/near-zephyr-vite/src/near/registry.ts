import { getRegistry, DEPLOY_REGISTRY_CONTRACT, accountExplorer } from './client'

/**
 * Direct mirror of the `DeploymentRecord` struct on the
 * `zephyr-contract/src/types.rs` side. near-sdk borsh-serializes structs for
 * view-method return values; near-kit `view<T>` decodes the JSON ABI return
 * back into this shape.
 */
export interface DeploymentRecord {
  deployer: string
  manifest_hash: string
  authorized: boolean
  url: string | null
  snapshot_id: string | null
  timestamp: number
}

export async function getDeployments(limit = 50): Promise<DeploymentRecord[]> {
  if (!DEPLOY_REGISTRY_CONTRACT) return []
  const near = getRegistry()
  const result = await near.view<DeploymentRecord[]>(
    DEPLOY_REGISTRY_CONTRACT,
    'get_deployments',
    { from_index: 0, limit },
  )
  return result ?? []
}

export async function getDeploymentsCount(): Promise<number> {
  if (!DEPLOY_REGISTRY_CONTRACT) return 0
  const near = getRegistry()
  const result = await near.view<number>(
    DEPLOY_REGISTRY_CONTRACT,
    'get_deployments_count',
    {},
  )
  return result ?? 0
}

export function accountUrl(account: string): string {
  return accountExplorer(account)
}