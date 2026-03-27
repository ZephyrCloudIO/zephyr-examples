import { useState } from 'react';
import './App.css';

const SLUG = 'bundlers/react-vite';
const REPO = 'https://github.com/ZephyrCloudIO/zephyr-examples';

function App() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText(
      `pnpm dlx degit ZephyrCloudIO/zephyr-examples/${SLUG} my-app`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      {/* Nav */}
      <nav className="nav">
        <a href="https://zephyr-cloud.io" target="_blank" rel="noreferrer" className="nav-brand">
          <img src="/zephyr.svg" alt="Zephyr Cloud" />
          <span>Zephyr Cloud</span>
        </a>
        <div className="nav-links">
          <a href="https://docs.zephyr-cloud.io" target="_blank" rel="noreferrer">Docs</a>
          <a href="https://app.zephyr-cloud.io" target="_blank" rel="noreferrer">Dashboard</a>
          <a href="https://app.zephyr-cloud.io" target="_blank" rel="noreferrer" className="nav-cta">
            Get Started Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="pulse" />
          Live Example — Deployed on Zephyr Edge
        </div>
        <div className="hero-logos">
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="logo-react">
            <img src="/react.svg" alt="React" />
          </a>
          <span className="separator">+</span>
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="logo-vite">
            <img src="/vite.svg" alt="Vite" />
          </a>
          <span className="separator">+</span>
          <a href="https://zephyr-cloud.io" target="_blank" rel="noreferrer" className="logo-zephyr">
            <img src="/zephyr.svg" alt="Zephyr Cloud" />
          </a>
        </div>
        <h1>
          React + Vite <span className="accent">Starter</span>
        </h1>
        <p className="hero-sub">
          A ready-to-use starter project deployed on Zephyr Cloud. Clone it, customize it, ship it.
        </p>
        <div className="stack">
          <span className="stack-item">React 19</span>
          <span className="stack-item">Vite</span>
          <span className="stack-item">TypeScript</span>
          <span className="stack-item">Zephyr Cloud</span>
        </div>
      </section>

      {/* Quick start */}
      <div className="quickstart-wrapper">
        <p className="quickstart-label">Get your own copy in seconds:</p>
        <div className="quickstart">
          <code>
            <span className="prompt">$</span> pnpm dlx degit ZephyrCloudIO/zephyr-examples/{SLUG} my-app
          </code>
          <button onClick={copyCommand} className={copied ? 'copied' : ''}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <section className="pipeline">
        <h2 className="section-title">How this example was deployed</h2>
        <p className="section-sub">Running <code>pnpm build</code> triggered five steps automatically.</p>
        <div className="pipeline-track">
          <div className="pipeline-step">
            <div className="pipeline-dot">1</div>
            <h3>Built</h3>
            <p>Vite compiled your app with <code>withZephyr()</code> wrapping the config</p>
          </div>
          <div className="pipeline-step">
            <div className="pipeline-dot">2</div>
            <h3>Uploaded</h3>
            <p>Assets hashed and uploaded to Zephyr's edge storage</p>
          </div>
          <div className="pipeline-step">
            <div className="pipeline-dot">3</div>
            <h3>Deployed</h3>
            <p>Live globally with a unique versioned URL in milliseconds</p>
          </div>
          <div className="pipeline-step">
            <div className="pipeline-dot">4</div>
            <h3>Versioned</h3>
            <p>Every build is immutable. Tag, compare, or rollback anytime</p>
          </div>
          <div className="pipeline-step">
            <div className="pipeline-dot">5</div>
            <h3>Promoted</h3>
            <p>Promote any version to staging, production, or custom environments</p>
          </div>
        </div>
      </section>

      {/* Feature spotlights */}
      <section className="features">
        <h2 className="section-title">What you get with Zephyr Cloud</h2>
        <p className="section-sub">This starter includes the same tooling used by production teams</p>

        <div className="feature-row">
          <div className="feature-text">
            <h3>Sub-second edge deploys</h3>
            <p>
              No containers, no cold starts. Your app is uploaded and served from
              edge nodes worldwide. Deploys complete in under a second — not minutes.
            </p>
          </div>
          <div className="feature-visual edge">
            <div className="globe-dots">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`globe-dot${[3, 7, 11, 17, 22].includes(i) ? ' active' : ''}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="feature-row reverse">
          <div className="feature-text">
            <h3>Instant rollbacks & version history</h3>
            <p>
              Every build is immutable and versioned. Roll back to any previous
              deployment in milliseconds. Compare versions side by side in the
              dashboard.
            </p>
          </div>
          <div className="feature-visual rollback">
            <div className="version-stack">
              <div className="version-bar current">v531 &nbsp;current</div>
              <div className="version-bar prev">v530</div>
              <div className="version-bar prev">v529</div>
              <div className="version-bar prev">v528</div>
            </div>
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-text">
            <h3>Module Federation at the edge</h3>
            <p>
              First-class support for micro-frontends. Zephyr resolves federated
              remotes at the edge — no hardcoded URLs, no deploy coordination, no
              downtime.
            </p>
          </div>
          <div className="feature-visual federation">
            <div className="mf-diagram">
              <div className="mf-node remote">App A</div>
              <span className="mf-arrow">&rarr;</span>
              <div className="mf-node host">Host</div>
              <span className="mf-arrow">&larr;</span>
              <div className="mf-node remote">App B</div>
            </div>
          </div>
        </div>

        <div className="feature-row reverse">
          <div className="feature-text">
            <h3>Bring Your Own Cloud</h3>
            <p>
              Your cloud, your choice. Deploy to Zephyr's built-in edge CDN or
              bring your own — AWS, Cloudflare, Fastly, and more. Switch clouds
              or deploy to multiple at once, all with a few clicks.
            </p>
          </div>
          <div className="feature-visual byoc">
            <div className="byoc-layout">
              <div className="byoc-source">
                <img src="/zephyr.svg" alt="Zephyr" />
              </div>
              <svg className="byoc-lines" viewBox="0 0 60 100" fill="none">
                <path d="M0 50 L60 10" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
                <path d="M0 50 L60 30" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
                <path d="M0 50 L60 50" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
                <path d="M0 50 L60 70" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
                <path d="M0 50 L60 90" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
              </svg>
              <div className="byoc-targets">
                <span className="byoc-pill">AWS</span>
                <span className="byoc-pill">Cloudflare</span>
                <span className="byoc-pill">Fastly</span>
                <span className="byoc-pill">Akamai</span>
                <span className="byoc-pill">Kubernetes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-content">
          <h2>Make this starter yours</h2>
          <p>Clone it, build on it, deploy it. Free tier includes unlimited previews.</p>
          <div className="cta-buttons">
            <a href="https://app.zephyr-cloud.io" target="_blank" rel="noreferrer" className="cta-primary">
              Start Deploying Free
            </a>
            <a href="https://docs.zephyr-cloud.io" target="_blank" rel="noreferrer" className="cta-secondary">
              Read the Docs
            </a>
          </div>
        </div>
      </section>

      {/* Resource cards */}
      <div className="cards">
        <a className="card" href="https://docs.zephyr-cloud.io" target="_blank" rel="noreferrer">
          <div className="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h3>Documentation <span className="arrow">&rarr;</span></h3>
          <p>Step-by-step guides to integrate Zephyr into any project.</p>
        </a>
        <a className="card" href="https://app.zephyr-cloud.io" target="_blank" rel="noreferrer">
          <div className="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <h3>Dashboard <span className="arrow">&rarr;</span></h3>
          <p>Manage deployments, versions, and environments.</p>
        </a>
        <a className="card" href={`${REPO}/tree/main/${SLUG}`} target="_blank" rel="noreferrer">
          <div className="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <h3>Source Code <span className="arrow">&rarr;</span></h3>
          <p>Browse this example and see how Zephyr integrates with Vite.</p>
        </a>
        <a className="card" href={REPO} target="_blank" rel="noreferrer">
          <div className="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3>More Examples <span className="arrow">&rarr;</span></h3>
          <p>26 examples: React, Angular, Solid, Svelte, MF, and more.</p>
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="https://zephyr-cloud.io" target="_blank" rel="noreferrer" className="footer-logo">
              <img src="/zephyr.svg" alt="Zephyr Cloud" />
              <span>Zephyr Cloud</span>
            </a>
            <p className="footer-tagline">The fastest way to go from idea to production.</p>
          </div>
          <div className="footer-col">
            <h4>Developers</h4>
            <a href="https://docs.zephyr-cloud.io" target="_blank" rel="noreferrer">Documentation</a>
            <a href={REPO} target="_blank" rel="noreferrer">Examples</a>
            <a href="https://app.zephyr-cloud.io" target="_blank" rel="noreferrer">Dashboard</a>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <a href="https://discord.gg/zephyrcloud" target="_blank" rel="noreferrer">Discord</a>
            <a href="https://github.com/ZephyrCloudIO" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://x.com/ZephyrCloudIO" target="_blank" rel="noreferrer">X / Twitter</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="https://zephyr-cloud.io" target="_blank" rel="noreferrer">Website</a>
            <a href="https://www.linkedin.com/company/96615966" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://zephyr-cloud.io/privacy" target="_blank" rel="noreferrer">Privacy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <a href="https://status.zephyr-cloud.io/" target="_blank" rel="noreferrer" className="status-badge">
            <span className="status-dot" />
            All systems operational
          </a>
          <p>&copy; {new Date().getFullYear()} Zephyr Cloud, Inc.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
