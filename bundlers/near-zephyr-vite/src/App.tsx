import { useEffect, useState } from 'react'
import { DEPLOY_REGISTRY_CONTRACT, accountExplorer } from './near/client'
import { getDeployments, getDeploymentsCount, type DeploymentRecord } from './near/registry'

function fmtTime(ms: number): string {
  if (!ms) return '—'
  return new Date(ms).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function shortHash(h: string): string {
  return h.length <= 12 ? h : `${h.slice(0, 8)}…${h.slice(-4)}`
}

export default function App() {
  const [records, setRecords] = useState<DeploymentRecord[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [err, setErr] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setErr(null)
    try {
      const c = await getDeploymentsCount()
      setCount(c)
      const recs = await getDeployments(50)
      setRecords(recs)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="shell">
      <header className="header">
        <h1>NEAR × Zephyr — Deploy Ledger</h1>
        <p className="subtitle">
          Zephyr Cloud deploys gated by a NEAR account signature via OutLayer TEE.
          Every deploy is provably attributable to a NEAR account on-chain.
        </p>
        <p style={{ marginTop: 10 }}>
          <span className="badge">{DEPLOY_REGISTRY_CONTRACT || 'no contract configured'}</span>
        </p>
      </header>

      <div className="flow">
        <div className="step">
          <strong>1 · sign</strong>NEAR account signs near-kit tx → <code>authorize_deploy(manifest_hash)</code>
        </div>
        <div className="step">
          <strong>2 · gate</strong>DeployRegistry → OutLayer TEE → releases <code>ZE_SERVER_TOKEN</code>
        </div>
        <div className="step">
          <strong>3 · build</strong>vite build + Zephyr Cloud upload using the gated token
        </div>
        <div className="step">
          <strong>4 · register</strong>onDeployComplete posts <code>register_deployment(url, snapshot_id)</code>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Deployer</th>
              <th>Manifest hash</th>
              <th>URL</th>
              <th>Snapshot</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="loading" colSpan={6}>Loading ledger…</td>
              </tr>
            )}
            {!loading && err && (
              <tr>
                <td className="empty" colSpan={6}>
                  <strong>Couldn't reach the contract.</strong>
                  <br />
                  <code style={{ fontSize: 11 }}>{err}</code>
                  <br />
                  <br />
                  Set <code>VITE_DEPLOY_REGISTRY_CONTRACT</code> in <code>.env</code>.
                </td>
              </tr>
            )}
            {!loading && !err && records.length === 0 && (
              <tr>
                <td className="empty" colSpan={6}>
                  No deploys recorded yet. Run <code>pnpm build</code>.
                </td>
              </tr>
            )}
            {!loading && !err &&
              records
                .slice()
                .reverse()
                .map((r, idx) => (
                  <tr key={`${r.manifest_hash}-${idx}`}>
                    <td>
                      {r.authorized ? (
                        r.url ? (
                          <span className="badge">
                            <span className="dot" /> deployed
                          </span>
                        ) : (
                          <span className="badge muted">
                            <span className="dot pending" /> authorized · awaiting register
                          </span>
                        )
                      ) : (
                        <span className="badge danger">
                          <span className="dot fail" /> rejected
                        </span>
                      )}
                    </td>
                    <td className="mono">
                      <a href={accountExplorer(r.deployer)} target="_blank" rel="noreferrer">
                        {r.deployer}
                      </a>
                    </td>
                    <td className="mono" title={r.manifest_hash}>{shortHash(r.manifest_hash)}</td>
                    <td className="mono">
                      {r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a> : '—'}
                    </td>
                    <td className="mono">{r.snapshot_id ? shortHash(r.snapshot_id) : '—'}</td>
                    <td className="mono">{fmtTime(Number(r.timestamp))}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <p>
          Total records: <strong>{count}</strong> ·{' '}
          <button
            type="button"
            onClick={refresh}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '4px 10px',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            refresh
          </button>
        </p>
        <p>
          <strong>How it works</strong> — a NEAR account signs (and pays) on-chain
          via the <code>DeployRegistry</code> contract. The contract verifies the
          signer and cross-calls OutLayer to run the <code>zephyr-auth-gate</code>{' '}
          WASM in a TEE. The gate reads the{' '}
          <code>ZE_SERVER_TOKEN</code> secret — stored as a{' '}
          <code>PROTECTED_</code> CKD secret on the OutLayer dashboard — and{' '}
          returns it in stdout. The callback logs it back, the build picks it up
          from receipts, and passes it to the Zephyr agent for the upload. After
          the upload, the URL + snapshot are registered back on the contract.
        </p>
        <p>
          See <a href="../../zephyr-auth-gate/README.md">zephyr-auth-gate</a> and
          {' '}<a href="../../zephyr-auth-gate/zephyr-contract/README.md">zephyr-contract</a>{' '}
          for the off-chain + on-chain halves.
        </p>
      </div>
    </div>
  )
}