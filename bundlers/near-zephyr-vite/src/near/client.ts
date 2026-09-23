import { Near } from 'near-kit'

/**
 * Read-only NEAR client for the deploy ledger view at runtime in the browser.
 *
 * The React app only calls `get_deployments` / `get_deployments_count` (view
 * methods) — it never sends signed transactions. View calls don't require a
 * signer or gas, so we construct `Near` with just `network`.
 */
export function getRegistry(): Near {
  const network = (import.meta.env.VITE_NEAR_NETWORK ?? 'testnet') as 'testnet' | 'mainnet'
  return new Near({ network })
}

export const DEPLOY_REGISTRY_CONTRACT =
  (import.meta.env.VITE_DEPLOY_REGISTRY_CONTRACT as string | undefined) ?? ''

const EXPLORER_BASE =
  ((import.meta.env.VITE_NEAR_NETWORK ?? 'testnet') as string) === 'mainnet'
    ? 'https://nearblocks.io'
    : 'https://testnet.nearblocks.io'

export function accountExplorer(account: string): string {
  return `${EXPLORER_BASE}/address/${account}`
}