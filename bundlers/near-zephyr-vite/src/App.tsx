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
          Zephyr Cloud deploys gated by a NEAR account signature. Every deploy
          is provably attributable to a NEAR account on-chain.
        </p>
        <p style={{ marginTop: 10 }}>
          <span className="badge">{DEPLOY_REGISTRY_CONTRACT || 'no contract configured'}</span>
        </p>
      </header>

      <div className="flow">
        <div className="step">
          <strong>1 · sign</strong>NEP-413 off-chain signature with NEAR key{' '}
          (free, no gas)
        </div>
        <div className="step">
          <strong>2 · proxy</strong>Auth proxy verifies signature + checks{' '}
          <code>is_authorized()</code> on-chain
        </div>
        <div className="step">
          <strong>3 · build</strong>vite build + Zephyr Cloud upload using the
          issued token
        </div>
        <div className="step">
          <strong>4 · register</strong>onDeployComplete posts{' '}
          <code>register_deployment(url, snapshot_id)</code>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
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
                <td className="loading" colSpan={5}>Loading ledger…</td>
              </tr>
            )}
            {!loading && err && (
              <tr>
                <td className="empty" colSpan={5}>
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
                <td className="empty" colSpan={5}>
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
          Total deploys: <strong>{count}</strong> ·{' '}
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
          <strong>How it works</strong> — a developer signs a deploy request with
          their NEAR private key (NEP-413 off-chain signature, free). The{' '}
          <code>near-zephyr-proxy</code> server verifies the signature and checks
          the <code>DeployRegistry</code> contract's{' '}
          <code>is_authorized(accountId)</code> view method. If authorized, the
          proxy returns a Zephyr <code>ZE_SERVER_TOKEN</code> for the build. After
          upload, <code>onDeployComplete</code> calls{' '}
          <code>register_deployment</code> to record the URL and snapshot on-chain.
        </p>
        <p>
          See <a href="../../zephyr-contract/README.md">zephyr-contract</a> and{' '}
          <a href="../../server/near-zephyr-proxy/README.md">near-zephyr-proxy</a>{' '}
          for the on-chain and server halves.
        </p>
      </div>
    </div>
  )
}
