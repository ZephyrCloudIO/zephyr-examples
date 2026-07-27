import { describe, it, expect } from 'vitest'
import { hashManifest } from '../scripts/manifest'
import { parseZephyrToken } from '../scripts/parse-logs'

describe('hashManifest', () => {
  it('produces a 64-char hex sha256', () => {
    const h = hashManifest('abc123', 'my-app', '1.0.0')
    expect(h).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic for the same inputs', () => {
    const a = hashManifest('abc123', 'my-app', '1.0.0')
    const b = hashManifest('abc123', 'my-app', '1.0.0')
    expect(a).toBe(b)
  })

  it('changes when any input changes', () => {
    const base = hashManifest('abc123', 'my-app', '1.0.0')
    expect(hashManifest('def456', 'my-app', '1.0.0')).not.toBe(base)
    expect(hashManifest('abc123', 'other-app', '1.0.0')).not.toBe(base)
    expect(hashManifest('abc123', 'my-app', '2.0.0')).not.toBe(base)
  })

  it('treats "nogit" as a valid fallback head', () => {
    const h = hashManifest('nogit', 'my-app', '1.0.0')
    expect(h).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe('parseZephyrToken', () => {
  it('extracts the token from a ZE_TOKEN: log', () => {
    const receipts = [
      { outcome: { logs: ['some other log', 'ZE_TOKEN:zephyr_live_abc123'] } },
      { outcome: { logs: [] } },
    ] as Array<{ outcome: { logs: string[] } }>
    const result = parseZephyrToken(receipts)
    expect(result.token).toBe('zephyr_live_abc123')
    expect(result.failures).toEqual([])
  })

  it('returns null token when only ZE_TOKEN_FAIL is present', () => {
    const receipts = [
      { outcome: { logs: ['ZE_TOKEN_FAIL:account not authorized'] } },
    ] as Array<{ outcome: { logs: string[] } }>
    const result = parseZephyrToken(receipts)
    expect(result.token).toBeNull()
    expect(result.failures).toEqual(['account not authorized'])
  })

  it('handles multiple receipts with mixed logs', () => {
    const receipts = [
      { outcome: { logs: ['init log'] } },
      { outcome: { logs: ['ZE_TOKEN_FAIL:OutLayer returned no result'] } },
      { outcome: { logs: ['ZE_TOKEN:tok_after_retry'] } },
    ] as Array<{ outcome: { logs: string[] } }>
    const result = parseZephyrToken(receipts)
    expect(result.token).toBe('tok_after_retry')
    expect(result.failures).toEqual(['OutLayer returned no result'])
  })

  it('returns null + empty failures when no ZE_TOKEN logs exist', () => {
    const receipts = [
      { outcome: { logs: ['unrelated log'] } },
    ] as Array<{ outcome: { logs: string[] } }>
    const result = parseZephyrToken(receipts)
    expect(result.token).toBeNull()
    expect(result.failures).toEqual([])
  })

  it('handles empty receipts array', () => {
    const result = parseZephyrToken([])
    expect(result.token).toBeNull()
    expect(result.failures).toEqual([])
  })
})