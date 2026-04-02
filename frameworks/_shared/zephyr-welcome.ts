export interface ZephyrWelcomeOptions {
  title: string;
  slug: string;
  bundlerName: string;
  frameworkLogo: string;
  bundlerLogo?: string;
  pills: string[];
}

const ZEPHYR_SVG = `<svg width="SIZE" height="SIZE" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.4 15c0 4.64-3.76 8.4-8.4 8.4-1.77 0-3.41-.55-4.77-1.48l-2.46 2.46c4.64 3.58 11.34 3.25 15.6-1 3.19-3.19 4.18-7.76 2.96-11.8-.2-.65.04-1.37.63-1.71.7-.4 1.59-.11 1.84.65.46 1.41.71 2.92.71 4.49 0 4.01-1.62 7.64-4.25 10.26l-.06.06c-2.62 2.59-6.23 4.19-10.2 4.19-1.74 0-3.41-.31-4.95-.87l-.73-.29-.12-.05c-1.34-.51-2.7-.93-4.08-1.27-.68-.17-1.37-.32-2.06-.45-.64-.12-.9-.91-.44-1.38l5.46-5.46A8.37 8.37 0 016.59 15c0-4.64 3.76-8.4 8.4-8.4 1.77 0 3.41.55 4.77 1.48l2.46-2.46C17.58 2.03 10.88 2.37 6.62 6.63 3.43 9.82 2.44 14.39 3.66 18.43c.2.65-.04 1.37-.63 1.71-.7.4-1.59.11-1.84-.65A14.47 14.47 0 01.48 15C.48 10.99 2.11 7.36 4.74 4.73 7.37 2.11 10.99.48 15 .48c1.74 0 3.41.31 4.95.87l.73.29.12.05c1.34.51 2.7.93 4.08 1.27.68.17 1.37.32 2.06.45.64.12.9.91.44 1.38l-5.46 5.46A8.37 8.37 0 0123.4 15zM14.85 20.73c3.16 0 5.73-2.57 5.73-5.73 0-.99-.25-1.92-.69-2.73l-7.77 7.77c.81.44 1.74.69 2.73.69zm0-11.46c-3.16 0-5.73 2.57-5.73 5.73 0 1.07.29 2.07.8 2.92l7.85-7.85a5.7 5.7 0 00-2.92-.8z" fill="white"/></svg>`;

const z = (size: number) => ZEPHYR_SVG.replace(/SIZE/g, String(size));
const REPO = 'https://github.com/ZephyrCloudIO/zephyr-examples';

function HTML(title: string, slug: string, bundler: string, logos: string, pills: string, cmd: string) {
  return `
<div class="zw">
<nav class="nav"><a href="https://zephyr-cloud.io" target="_blank" class="brand">${z(28)}<span>Zephyr Cloud</span></a><div class="nav-links"><a href="https://docs.zephyr-cloud.io" target="_blank">Docs</a><a href="https://app.zephyr-cloud.io" target="_blank">Dashboard</a><a href="https://app.zephyr-cloud.io" target="_blank" class="cta-btn">Get Started Free</a></div></nav>

<section class="hero">
<div class="badge"><span class="pulse"></span>Live Example — Deployed on Zephyr Edge</div>
<div class="logos">${logos}</div>
<h1>${title} <span class="accent">Starter</span></h1>
<p class="sub">A ready-to-use starter project deployed on Zephyr Cloud. Clone it, customize it, ship it.</p>
<div class="stack">${pills}</div>
</section>

<div class="qs-wrap"><p class="qs-label">Get your own copy in seconds:</p><div class="qs"><code><span class="pr">$</span> ${cmd}</code><button id="copy-btn">Copy</button></div></div>

<section class="pipeline">
<h2 class="stitle">How this example was deployed</h2>
<p class="ssub">Running <code>pnpm build</code> triggered five steps automatically.</p>
<div class="track">
<div class="step"><div class="dot d1">1</div><h3>Built</h3><p>${bundler} compiled your app with <code>withZephyr()</code></p></div>
<div class="step"><div class="dot d2">2</div><h3>Uploaded</h3><p>Assets hashed and uploaded to edge storage</p></div>
<div class="step"><div class="dot d3">3</div><h3>Deployed</h3><p>Live globally with a versioned URL in ms</p></div>
<div class="step"><div class="dot d4">4</div><h3>Versioned</h3><p>Every build is immutable. Rollback anytime</p></div>
<div class="step"><div class="dot d5">5</div><h3>Promoted</h3><p>Promote to staging, production, or custom envs</p></div>
</div></section>

<section class="features">
<h2 class="stitle">What you get with Zephyr Cloud</h2>
<p class="ssub">This starter includes the same tooling used by production teams</p>
<div class="frow"><div class="ftxt"><h3>Sub-second edge deploys</h3><p>No containers, no cold starts. Deployed from edge nodes worldwide in under a second.</p></div><div class="fvis edge"><div class="gdots">${Array.from({length:25}).map((_,i)=>`<div class="gd${[3,7,11,17,22].includes(i)?' on':''}"></div>`).join('')}</div></div></div>
<div class="frow rev"><div class="ftxt"><h3>Instant rollbacks &amp; version history</h3><p>Every build is immutable. Roll back in milliseconds. Compare versions in the dashboard.</p></div><div class="fvis rb"><div class="vstack"><div class="vbar cur">v531 &nbsp;current</div><div class="vbar prv">v530</div><div class="vbar prv">v529</div><div class="vbar prv">v528</div></div></div></div>
<div class="frow"><div class="ftxt"><h3>Module Federation at the edge</h3><p>Resolve federated remotes at the edge — no hardcoded URLs, no coordination.</p></div><div class="fvis mf"><div class="mfd"><div class="mfn rem">App A</div><span class="mfa">\u2192</span><div class="mfn host">Host</div><span class="mfa">\u2190</span><div class="mfn rem">App B</div></div></div></div>
<div class="frow rev"><div class="ftxt"><h3>Bring Your Own Cloud</h3><p>Deploy to Zephyr's edge or bring your own — AWS, Cloudflare, Fastly, and more.</p></div><div class="fvis byoc"><div class="byoc-l"><div class="byoc-s">${z(36)}</div><svg class="byoc-ln" viewBox="0 0 60 100" fill="none"><path d="M0 50 L60 10" stroke="rgba(245,158,11,.3)" stroke-width="1" stroke-dasharray="3 3"/><path d="M0 50 L60 30" stroke="rgba(245,158,11,.3)" stroke-width="1" stroke-dasharray="3 3"/><path d="M0 50 L60 50" stroke="rgba(245,158,11,.3)" stroke-width="1" stroke-dasharray="3 3"/><path d="M0 50 L60 70" stroke="rgba(245,158,11,.3)" stroke-width="1" stroke-dasharray="3 3"/><path d="M0 50 L60 90" stroke="rgba(245,158,11,.3)" stroke-width="1" stroke-dasharray="3 3"/></svg><div class="byoc-t"><span class="bp">AWS</span><span class="bp">Cloudflare</span><span class="bp">Fastly</span><span class="bp">Akamai</span><span class="bp">Kubernetes</span></div></div></div></div>
</section>

<section class="cta-sec"><div class="ctac">
<h2>Make this starter yours</h2>
<p>Clone it, build on it, deploy it. Free tier includes unlimited previews.</p>
<div class="cta-btns"><a href="https://app.zephyr-cloud.io" target="_blank" class="cta-pri">Start Deploying Free</a><a href="https://docs.zephyr-cloud.io" target="_blank" class="cta-sec2">Read the Docs</a></div>
</div></section>

<div class="cards">
<a class="card" href="https://docs.zephyr-cloud.io" target="_blank"><div class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div><h3>Documentation <span class="arr">\u2192</span></h3><p>Step-by-step guides to integrate Zephyr.</p></a>
<a class="card" href="https://app.zephyr-cloud.io" target="_blank"><div class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div><h3>Dashboard <span class="arr">\u2192</span></h3><p>Manage deployments, versions, and environments.</p></a>
<a class="card" href="${REPO}/tree/main/${slug}" target="_blank"><div class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><h3>Source Code <span class="arr">\u2192</span></h3><p>See how Zephyr integrates with ${bundler}.</p></a>
<a class="card" href="${REPO}" target="_blank"><div class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></div><h3>More Examples <span class="arr">\u2192</span></h3><p>26 examples across React, Angular, Solid, and more.</p></a>
</div>

<footer class="ft">
<div class="ft-grid">
<div class="ft-brand"><a href="https://zephyr-cloud.io" target="_blank" class="ft-logo">${z(22)}<span>Zephyr Cloud</span></a><p class="ft-tag">The fastest way to go from idea to production.</p></div>
<div class="ft-col"><h4>Developers</h4><a href="https://docs.zephyr-cloud.io" target="_blank">Documentation</a><a href="${REPO}" target="_blank">Examples</a><a href="https://app.zephyr-cloud.io" target="_blank">Dashboard</a></div>
<div class="ft-col"><h4>Community</h4><a href="https://discord.gg/zephyrcloud" target="_blank">Discord</a><a href="https://github.com/ZephyrCloudIO" target="_blank">GitHub</a><a href="https://x.com/ZephyrCloudIO" target="_blank">X / Twitter</a></div>
<div class="ft-col"><h4>Company</h4><a href="https://zephyr-cloud.io" target="_blank">Website</a><a href="https://www.linkedin.com/company/96615966" target="_blank">LinkedIn</a><a href="https://zephyr-cloud.io/privacy" target="_blank">Privacy</a></div>
</div>
<div class="ft-bot"><a href="https://status.zephyr-cloud.io/" target="_blank" class="status"><span class="sdot"></span>All systems operational</a><p>\u00a9 ${new Date().getFullYear()} Zephyr Cloud, Inc.</p></div>
</footer>
</div>`;
}

const CSS = `
:host{display:block;font-family:Inter,system-ui,Avenir,Helvetica,Arial,sans-serif;line-height:1.5;color:rgba(255,255,255,.87);background:#010101;-webkit-font-smoothing:antialiased}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
a{color:inherit;text-decoration:none}
.zw{max-width:1120px;margin:0 auto;padding:0 1.5rem;min-height:100vh;display:flex;flex-direction:column}
.nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 0;border-bottom:1px solid rgba(255,255,255,.06)}
.brand{display:flex;align-items:center;gap:.5rem;font-weight:600;font-size:1rem;letter-spacing:-.01em}
.nav-links{display:flex;align-items:center;gap:1.5rem;font-size:.875rem;color:rgba(255,255,255,.5)}
.nav-links a{transition:color .2s}.nav-links a:hover{color:rgba(255,255,255,.9)}
.cta-btn{background:#059669;color:#fff!important;padding:.5rem 1rem;border-radius:8px;font-weight:500;transition:all .2s}.cta-btn:hover{background:#047857}
.hero{text-align:center;padding:5rem 0 3rem}
.badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(5,150,105,.08);border:1px solid rgba(5,150,105,.2);color:#34d399;font-size:.75rem;font-weight:500;padding:.375rem .875rem;border-radius:999px;margin-bottom:2rem;letter-spacing:.02em}
.pulse{width:6px;height:6px;background:#34d399;border-radius:50%;animation:p 2s ease-in-out infinite}
@keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
.logos{display:flex;align-items:center;justify-content:center;gap:1.5rem;margin-bottom:2rem}
.logos svg{height:56px;width:auto;transition:all .3s ease}
.logos a:hover svg{transform:scale(1.1)}
.sep{color:rgba(255,255,255,.3);font-size:1.25rem;font-weight:300}
.hero h1{font-size:2.75rem;font-weight:700;letter-spacing:-.03em;line-height:1.1;margin-bottom:1rem}
.accent{background:linear-gradient(135deg,#34d399,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{color:rgba(255,255,255,.45);font-size:1.0625rem;max-width:520px;margin:0 auto;line-height:1.6}
.stack{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-top:1.75rem}
.pill{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:.3125rem .875rem;font-size:.8125rem;color:rgba(255,255,255,.5)}
.qs-wrap{margin:0 auto 5rem;max-width:640px}
.qs-label{font-size:.8125rem;color:rgba(255,255,255,.5);text-align:center;margin-bottom:.625rem}
.qs{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:1rem 1.5rem;display:flex;align-items:center;gap:.75rem}
.qs code{flex:1;font-family:'SF Mono','Fira Code',Menlo,Consolas,monospace;font-size:.875rem;color:rgba(255,255,255,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr{color:#34d399}
.qs button{background:0 0;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);padding:.375rem .875rem;border-radius:6px;font-size:.75rem;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:inherit;font-weight:500}
.qs button:hover{border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.8)}
.qs button.copied{border-color:#34d399;color:#34d399}
.stitle{font-size:1.375rem;font-weight:600;text-align:center;margin-bottom:.375rem;letter-spacing:-.01em}
.stitle code{font-family:'SF Mono','Fira Code',Menlo,monospace;background:0 0;color:#34d399;font-size:.85em}
.ssub{text-align:center;color:rgba(255,255,255,.35);font-size:.9375rem;margin-bottom:1.5rem}
.pipeline{margin-bottom:4rem;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:2rem 1.5rem .5rem}
.track{display:flex;align-items:stretch;position:relative}
.track::before{content:'';position:absolute;top:calc(1.5rem + 18px);left:10%;right:10%;height:1px;background:linear-gradient(90deg,rgba(5,150,105,.3),rgba(59,130,246,.3),rgba(168,85,247,.3),rgba(245,158,11,.3),rgba(236,72,153,.3));z-index:0}
.step{flex:1;text-align:center;padding:1.5rem 1rem;position:relative}
.dot{width:36px;height:36px;margin:0 auto .75rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8125rem;font-weight:700;position:relative;z-index:1}
.d1{background:#0a1f15;color:#34d399;box-shadow:0 0 0 2px #0a1f15,0 0 0 3px rgba(5,150,105,.4)}
.d2{background:#0a1526;color:#60a5fa;box-shadow:0 0 0 2px #0a1526,0 0 0 3px rgba(59,130,246,.4)}
.d3{background:#160a26;color:#c084fc;box-shadow:0 0 0 2px #160a26,0 0 0 3px rgba(168,85,247,.4)}
.d4{background:#1a1508;color:#fbbf24;box-shadow:0 0 0 2px #1a1508,0 0 0 3px rgba(245,158,11,.4)}
.d5{background:#1a0a14;color:#f472b6;box-shadow:0 0 0 2px #1a0a14,0 0 0 3px rgba(236,72,153,.4)}
.step h3{font-size:.9375rem;font-weight:600;margin-bottom:.25rem}
.step p{font-size:.8125rem;color:rgba(255,255,255,.45);line-height:1.5}
.step code{font-family:'SF Mono','Fira Code',Menlo,monospace;font-size:.85em;color:#34d399;background:0 0}
.features{margin-bottom:4rem;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:2rem 2rem 0}
.frow{display:flex;align-items:center;gap:2.5rem;padding:2rem 0;border-bottom:1px solid rgba(255,255,255,.08)}
.frow:last-child{border-bottom:0}.frow.rev{flex-direction:row-reverse}
.ftxt{flex:1}.ftxt h3{font-size:1.125rem;font-weight:600;margin-bottom:.5rem}
.ftxt p{font-size:.9375rem;color:rgba(255,255,255,.55);line-height:1.6}
.ftxt code{font-family:'SF Mono','Fira Code',Menlo,monospace;font-size:.85em;color:#34d399;background:0 0}
.fvis{flex:0 0 260px;height:160px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.fvis.edge{background:linear-gradient(135deg,rgba(5,150,105,.1),rgba(5,150,105,.04));border:1px solid rgba(5,150,105,.18)}
.fvis.rb{background:linear-gradient(135deg,rgba(168,85,247,.1),rgba(168,85,247,.04));border:1px solid rgba(168,85,247,.18)}
.fvis.mf{background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(59,130,246,.04));border:1px solid rgba(59,130,246,.18)}
.fvis.byoc{background:linear-gradient(135deg,rgba(245,158,11,.1),rgba(245,158,11,.04));border:1px solid rgba(245,158,11,.18)}
.gdots{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.gd{width:8px;height:8px;border-radius:50%;background:rgba(52,211,153,.2)}
.gd.on{background:#34d399;animation:g 2s ease-in-out infinite}
@keyframes g{0%,100%{box-shadow:0 0 4px rgba(52,211,153,.4)}50%{box-shadow:0 0 12px rgba(52,211,153,.6)}}
.vstack{display:flex;flex-direction:column;gap:6px;width:160px}
.vbar{height:28px;border-radius:6px;display:flex;align-items:center;padding:0 10px;font-size:.6875rem;font-family:'SF Mono',monospace;font-weight:500}
.vbar.cur{background:rgba(168,85,247,.2);border:1px solid rgba(168,85,247,.4);color:#c084fc}
.vbar.prv{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.4)}
.mfd{display:flex;gap:8px;align-items:center}
.mfn{width:56px;height:56px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.625rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.mfn.host{background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);color:#60a5fa}
.mfn.rem{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55)}
.mfa{color:rgba(255,255,255,.25);font-size:.875rem}
.byoc-l{display:flex;align-items:center;width:100%;height:100%;padding:0 1.5rem}
.byoc-s{flex-shrink:0}.byoc-s svg{filter:drop-shadow(0 0 8px rgba(52,211,153,.3))}
.byoc-ln{flex:0 0 50px;height:100px}
.byoc-t{display:flex;flex-direction:column;gap:4px}
.bp{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:.25rem .75rem;font-size:.6875rem;font-weight:500;color:rgba(255,255,255,.6);white-space:nowrap}
.cta-sec{margin-bottom:4rem}
.ctac{background:linear-gradient(135deg,rgba(5,150,105,.1),rgba(5,150,105,.04));border:1px solid rgba(5,150,105,.2);border-radius:16px;padding:3.5rem 2rem;text-align:center}
.ctac h2{font-size:1.625rem;font-weight:700;margin-bottom:.5rem;letter-spacing:-.02em}
.ctac p{color:rgba(255,255,255,.55);margin-bottom:2rem;font-size:.9375rem}
.cta-btns{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
.cta-pri{background:#059669;color:#fff;padding:.75rem 2rem;border-radius:10px;font-weight:600;font-size:.9375rem;transition:all .2s;display:inline-block}.cta-pri:hover{background:#047857;transform:translateY(-1px)}
.cta-sec2{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.65);padding:.75rem 2rem;border-radius:10px;font-weight:500;font-size:.9375rem;transition:all .2s;display:inline-block}.cta-sec2:hover{border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.9)}
.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:3rem}
.card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:1.25rem 1.5rem;transition:all .2s;display:grid;grid-template-columns:36px 1fr;grid-template-rows:auto auto;column-gap:1rem;row-gap:.125rem;align-items:start}
.card:hover{border-color:rgba(5,150,105,.2);background:rgba(5,150,105,.03)}
.ci{width:36px;height:36px;background:rgba(5,150,105,.08);border:1px solid rgba(5,150,105,.15);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#34d399;grid-row:span 2;align-self:center}
.card h3{font-size:.875rem;font-weight:600;display:flex;align-items:center;gap:.5rem}
.arr{opacity:0;transition:all .2s;transform:translateX(-4px);color:#34d399}.card:hover .arr{opacity:1;transform:translateX(0)}
.card p{font-size:.8125rem;color:rgba(255,255,255,.45);line-height:1.5}
.ft{margin-top:auto;padding:3rem 0 2rem;border-top:1px solid rgba(255,255,255,.08)}
.ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem;margin-bottom:2.5rem}
.ft-brand{display:flex;flex-direction:column;gap:.75rem}
.ft-logo{display:flex;align-items:center;gap:.5rem;font-weight:600;font-size:.9375rem;color:rgba(255,255,255,.9)}
.ft-tag{font-size:.8125rem;color:rgba(255,255,255,.5);line-height:1.5;max-width:240px}
.ft-col{display:flex;flex-direction:column;gap:.5rem}
.ft-col h4{font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.8);margin-bottom:.25rem}
.ft-col a{font-size:.8125rem;color:rgba(255,255,255,.55);transition:color .2s}.ft-col a:hover{color:rgba(255,255,255,.8)}
.ft-bot{display:flex;align-items:center;justify-content:space-between;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.08)}
.ft-bot p{font-size:.75rem;color:rgba(255,255,255,.45)}
.status{display:inline-flex;align-items:center;gap:.5rem;padding:.375rem .875rem;border-radius:999px;background:rgba(5,150,105,.06);border:1px solid rgba(5,150,105,.15);font-size:.75rem;color:rgba(52,211,153,.8);transition:all .2s}.status:hover{border-color:rgba(5,150,105,.25);color:#34d399}
.sdot{width:6px;height:6px;border-radius:50%;background:#34d399;animation:p 2s ease-in-out infinite}
@media(max-width:700px){.track{flex-direction:column;gap:.5rem}.track::before{display:none}.step{text-align:left;padding:1rem;display:flex;gap:1rem;align-items:flex-start}.dot{margin:0;flex-shrink:0}.frow,.frow.rev{flex-direction:column;gap:1.5rem}.fvis{flex:none;width:100%;height:140px}}
@media(max-width:600px){.nav-links a:not(.cta-btn){display:none}.hero h1{font-size:2rem}.cards{grid-template-columns:1fr}.ft-grid{grid-template-columns:1fr 1fr;gap:1.5rem}.ft-brand{grid-column:span 2}.ft-bot{flex-direction:column;gap:.75rem;text-align:center}.ctac{padding:2rem 1.25rem}}
`;

export function mountZephyrWelcome(container: HTMLElement, options: ZephyrWelcomeOptions): void {
  // Reset host page styles
  document.body.style.margin = '0';
  document.body.style.display = 'block';
  document.body.style.minHeight = '0';
  document.body.style.background = '#010101';
  const root = document.getElementById('root') || document.getElementById('app');
  if (root) {
    root.style.maxWidth = 'none';
    root.style.padding = '0';
    root.style.textAlign = 'initial';
  }

  if (container.shadowRoot) return;
  const shadow = container.attachShadow({ mode: 'open' });
  const cmd = `pnpm dlx degit ZephyrCloudIO/zephyr-examples/${options.slug} my-app`;

  const logos = options.frameworkLogo
    + (options.bundlerLogo ? `<span class="sep">+</span>${options.bundlerLogo}` : '')
    + `<span class="sep">+</span><a href="https://zephyr-cloud.io" target="_blank">${z(56)}</a>`;

  const stackHtml = options.pills.map(p => `<span class="pill">${p}</span>`).join('');

  shadow.innerHTML = `<style>${CSS}</style>${HTML(options.title, options.slug, options.bundlerName, logos, stackHtml, cmd)}`;

  shadow.getElementById('copy-btn')?.addEventListener('click', function(this: HTMLElement) {
    navigator.clipboard.writeText(cmd);
    this.textContent = 'Copied!';
    this.classList.add('copied');
    setTimeout(() => { this.textContent = 'Copy'; this.classList.remove('copied'); }, 2000);
  });
}
