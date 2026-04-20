import * as React from 'react';

const Remote1 = React.lazy(() => import('turbo_home/RemoteEntry'));
const Remote2 = React.lazy(() => import('turbo_settings/RemoteEntry'));

type RemoteKey = 'turbo_home' | 'turbo_settings';

interface BoundaryProps {
  name: RemoteKey;
  expose: string;
  accent: string;
  accentSoft: string;
  tagline: string;
  children: React.ReactNode;
}

function RemoteBoundary({ name, expose, accent, accentSoft, tagline, children }: BoundaryProps) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: `1px dashed ${accent}`,
        boxShadow: `0 20px 60px -30px ${accent}`,
      }}
    >
      {/* Header row — inside the card, no border-straddle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: `1px solid ${accent}`,
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: accent,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: accent,
              animation: 'ze-pulse 1.6s ease-in-out infinite',
              boxShadow: `0 0 8px ${accent}`,
            }}
          />
          {name}/{expose}
        </span>

        <span
          style={{
            padding: '4px 10px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: `1px solid ${accentSoft}`,
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: accentSoft,
            textTransform: 'uppercase',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          Live · Federated
        </span>
      </div>

      <div
        style={{
          marginBottom: '14px',
          fontSize: '11px',
          color: accentSoft,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {tagline}
      </div>

      {/* Remote content */}
      <div
        style={{
          paddingTop: '14px',
          borderTop: `1px solid ${accentSoft}`,
        }}
      >
        <React.Suspense
          fallback={
            <div style={{ color: accentSoft, fontSize: '13px', padding: '20px 0' }}>
              Loading remote bundle…
            </div>
          }
        >
          {children}
        </React.Suspense>
      </div>
    </div>
  );
}

interface TogglePillProps {
  label: string;
  on: boolean;
  accent: string;
  accentSoft: string;
  onClick: () => void;
}

function TogglePill({ label, on, accent, accentSoft, onClick }: TogglePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '999px',
        border: `1px solid ${on ? accent : 'rgba(148, 163, 184, 0.3)'}`,
        background: on ? `${accentSoft}` : 'rgba(255, 255, 255, 0.02)',
        color: on ? accent : '#94a3b8',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: on ? accent : '#475569',
          boxShadow: on ? `0 0 10px ${accent}` : 'none',
          transition: 'all 0.15s ease',
        }}
      />
      {label}
      <span
        style={{
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: on ? accent : '#64748b',
          opacity: 0.8,
        }}
      >
        {on ? 'visible' : 'hidden'}
      </span>
    </button>
  );
}

export function FederationDemo() {
  const [show1, setShow1] = React.useState(true);
  const [show2, setShow2] = React.useState(true);

  return (
    <section
      style={{
        color: '#e5e7eb',
        padding: '0',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {/* keyframe injected once */}
      <style>{`@keyframes ze-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>

      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            ⚡ Module Federation — Live
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px', color: '#f8fafc' }}>
            Two remotes. One page. Zero bundling.
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            The panels below are not bundled with this host. Each is an independently-built,
            independently-deployed micro-frontend loaded at runtime via{' '}
            <code style={{ color: '#c7d2fe', fontSize: '13px' }}>@module-federation/enhanced</code>.
            Toggle them below — each hide/show unmounts or re-fetches the remote bundle.
          </p>
        </div>

        {/* Toggle controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '36px',
          }}
        >
          <TogglePill
            label="turbo_home"
            on={show1}
            accent="#f59e0b"
            accentSoft="rgba(245, 158, 11, 0.15)"
            onClick={() => setShow1((v) => !v)}
          />
          <TogglePill
            label="turbo_settings"
            on={show2}
            accent="#8b5cf6"
            accentSoft="rgba(139, 92, 246, 0.15)"
            onClick={() => setShow2((v) => !v)}
          />
        </div>

        {/* Remote grid */}
        {show1 || show2 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: show1 && show2 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
              gap: '28px',
              maxWidth: show1 && show2 ? '100%' : '520px',
              margin: '0 auto',
            }}
          >
            {show1 && (
              <RemoteBoundary
                name="turbo_home"
                expose="./RemoteEntry"
                accent="#f59e0b"
                accentSoft="rgba(245, 158, 11, 0.45)"
                tagline="apps/home · built & deployed independently"
              >
                <Remote1 />
              </RemoteBoundary>
            )}

            {show2 && (
              <RemoteBoundary
                name="turbo_settings"
                expose="./RemoteEntry"
                accent="#8b5cf6"
                accentSoft="rgba(139, 92, 246, 0.45)"
                tagline="apps/settings · built & deployed independently"
              >
                <Remote2 />
              </RemoteBoundary>
            )}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#64748b',
              fontSize: '14px',
              border: '1px dashed rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
            }}
          >
            Both remotes unmounted. Toggle a pill above to re-fetch and render.
          </div>
        )}

        <div
          style={{
            marginTop: '40px',
            padding: '20px 24px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: '#e2e8f0' }}>What just happened?</strong> The host requested{' '}
          <code style={{ color: '#c7d2fe' }}>turbo_home/RemoteEntry</code> and{' '}
          <code style={{ color: '#c7d2fe' }}>turbo_settings/RemoteEntry</code> at runtime. Rspack + Module
          Federation resolved the manifests, downloaded the remote bundles, and shared the React
          runtime between host and remotes (single instance, no duplication). Open DevTools →
          Network → filter <code style={{ color: '#c7d2fe' }}>remoteEntry</code> and watch the
          toggles above: each hide unmounts the component tree; each show refetches if the bundle
          isn't cached.
        </div>
      </div>
    </section>
  );
}

export default FederationDemo;
