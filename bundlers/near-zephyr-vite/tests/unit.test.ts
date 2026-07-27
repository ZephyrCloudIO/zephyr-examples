import { describe, it, expect } from 'vitest'
import { hashManifest } from '../scripts/manifest'

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
