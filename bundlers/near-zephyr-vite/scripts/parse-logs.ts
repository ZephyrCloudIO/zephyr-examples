/**
 * Extract the `ZE_TOKEN:<token>` log line emitted by the
 * `DeployRegistry.on_deploy_authorized` callback from near-kit transaction
 * receipts.
 *
 * near-kit's `FinalExecutionOutcome.receipts_outcome` is an array of
 * `{ outcome: { logs: string[] } }` for every receipt in the transaction
 * chain (including the cross-contract OutLayer yield/resume callback). The
 * DeployRegistry callback emits `ZE_TOKEN:<token>` on success or
 * `ZE_TOKEN_FAIL:<reason>` on failure.
 */
export interface ParsedReceipts {
  token: string | null
  failures: string[]
}

export function parseZephyrToken(receiptsOutcome: Array<{ outcome: { logs: string[] } }>): ParsedReceipts {
  const logs = receiptsOutcome.flatMap((r) => r.outcome.logs)
  const failures: string[] = []
  let token: string | null = null

  for (const line of logs) {
    if (line.startsWith('ZE_TOKEN:')) {
      token = line.slice('ZE_TOKEN:'.length).trim()
    } else if (line.startsWith('ZE_TOKEN_FAIL:')) {
      failures.push(line.slice('ZE_TOKEN_FAIL:'.length).trim())
    }
  }

  return { token, failures }
}