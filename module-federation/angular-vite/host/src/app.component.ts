import { NgComponentOutlet } from '@angular/common';
import { Component, signal, Type } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <main class="shell">
      <nav class="nav">
        <a class="brand" href="https://zephyr-cloud.io" target="_blank">
          <span class="brand-mark">Z</span>
          <span>Zephyr Cloud</span>
        </a>
        <div class="nav-links">
          <a href="https://docs.zephyr-cloud.io" target="_blank">Docs</a>
          <a href="https://app.zephyr-cloud.io" target="_blank">Dashboard</a>
          <a class="cta-btn" href="https://app.zephyr-cloud.io" target="_blank">Get Started Free</a>
        </div>
      </nav>

      <section class="hero">
        <div class="badge"><span class="pulse"></span>Live Example - Module Federation on Zephyr Edge</div>

        <div class="logos" aria-label="Technology stack">
          <span class="logo angular">A</span>
          <span class="sep">+</span>
          <span class="logo vite">V</span>
          <span class="sep">+</span>
          <span class="logo zephyr">Z</span>
        </div>

        <h1>Angular + Vite <span>Module Federation</span></h1>
        <p class="sub">
          A host app loading a standalone Angular remote at runtime, using the
          same Zephyr Cloud starter surface as the React + Vite example.
        </p>

        <div class="stack">
          <span>Angular 21</span>
          <span>Vite 8</span>
          <span>Module Federation</span>
          <span>Zephyr Cloud</span>
        </div>
      </section>

      <section class="quickstart">
        <p>Get your own copy in seconds:</p>
        <div>
          <code><span>$</span> pnpm dlx degit ZephyrCloudIO/zephyr-examples/module-federation/angular-vite my-app</code>
        </div>
      </section>

      <section class="remote-slot" aria-label="Federated remote component">
        <div class="section-heading">
          <h2>Remote loaded by the host</h2>
          <p>The card is compiled and served by <code>angular_remote</code>.</p>
        </div>
        @if (remoteComponent()) {
          <ng-container *ngComponentOutlet="remoteComponent()" />
        } @else {
          <div class="loading">Loading remote component...</div>
        }
      </section>

      <section class="cards">
        <article>
          <span>1</span>
          <h3>Built</h3>
          <p>Angular is compiled through Vite with federation config.</p>
        </article>
        <article>
          <span>2</span>
          <h3>Uploaded</h3>
          <p>Zephyr uploads immutable assets during the production build.</p>
        </article>
        <article>
          <span>3</span>
          <h3>Resolved</h3>
          <p>The host resolves its remote dependency at deploy time.</p>
        </article>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        color: rgb(255 255 255 / 87%);
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
      }

      .shell {
        background: #010101;
        box-sizing: border-box;
        min-height: 100vh;
        padding: 0 24px 56px;
      }

      .nav,
      .hero,
      .quickstart,
      .remote-slot,
      .cards {
        margin: 0 auto;
        max-width: 1120px;
      }

      .nav {
        align-items: center;
        border-bottom: 1px solid rgb(255 255 255 / 6%);
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .brand {
        align-items: center;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        gap: 8px;
      }

      .brand-mark,
      .logo {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-weight: 800;
        justify-content: center;
      }

      .brand-mark {
        background: #059669;
        color: #fff;
        height: 28px;
        width: 28px;
      }

      .nav-links {
        align-items: center;
        color: rgb(255 255 255 / 52%);
        display: flex;
        font-size: 14px;
        gap: 24px;
      }

      .nav-links a:hover {
        color: rgb(255 255 255 / 90%);
      }

      .cta-btn {
        background: #059669;
        border-radius: 8px;
        color: #fff !important;
        font-weight: 500;
        padding: 8px 16px;
      }

      .hero {
        padding: 80px 0 42px;
        text-align: center;
      }

      .badge {
        align-items: center;
        background: rgb(5 150 105 / 8%);
        border: 1px solid rgb(5 150 105 / 20%);
        border-radius: 999px;
        color: #34d399;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        letter-spacing: 0.02em;
        margin-bottom: 32px;
        padding: 6px 14px;
      }

      .pulse {
        animation: pulse 2s ease-in-out infinite;
        background: #34d399;
        border-radius: 50%;
        height: 6px;
        width: 6px;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      .logos {
        align-items: center;
        display: flex;
        gap: 24px;
        justify-content: center;
        margin-bottom: 32px;
      }

      .logo {
        font-size: 24px;
        height: 56px;
        width: 56px;
      }

      .angular {
        background: linear-gradient(135deg, #dd0031, #c3002f);
      }

      .vite {
        background: linear-gradient(135deg, #41d1ff, #bd34fe);
      }

      .zephyr {
        background: #059669;
      }

      .sep {
        color: rgb(255 255 255 / 30%);
        font-size: 20px;
      }

      h1 {
        font-size: clamp(40px, 7vw, 72px);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1.05;
        margin: 0;
      }

      h1 span {
        background: linear-gradient(135deg, #34d399, #059669);
        background-clip: text;
        color: transparent;
        display: block;
      }

      .sub {
        color: rgb(255 255 255 / 45%);
        font-size: 17px;
        line-height: 1.6;
        margin: 18px auto 0;
        max-width: 620px;
      }

      .stack {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        margin-top: 28px;
      }

      .stack span {
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 999px;
        color: rgb(255 255 255 / 55%);
        font-size: 13px;
        padding: 5px 14px;
      }

      .quickstart {
        margin-bottom: 64px;
        max-width: 720px;
      }

      .quickstart p {
        color: rgb(255 255 255 / 50%);
        font-size: 13px;
        margin: 0 0 10px;
        text-align: center;
      }

      .quickstart div {
        background: rgb(255 255 255 / 3.5%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 12px;
        overflow: hidden;
        padding: 16px 24px;
      }

      code {
        color: rgb(255 255 255 / 66%);
        font-family: "SF Mono", "Fira Code", Menlo, Consolas, monospace;
        font-size: 14px;
      }

      code span,
      .section-heading code {
        color: #34d399;
      }

      .remote-slot {
        background: rgb(255 255 255 / 3.5%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 16px;
        box-sizing: border-box;
        margin-bottom: 24px;
        padding: 32px;
      }

      .section-heading {
        margin: 0 0 24px;
        text-align: center;
      }

      .section-heading h2 {
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.01em;
        margin: 0 0 6px;
      }

      .section-heading p {
        color: rgb(255 255 255 / 35%);
        font-size: 15px;
        margin: 0;
      }

      .loading {
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 8px;
        color: rgb(255 255 255 / 50%);
        padding: 28px;
        text-align: center;
      }

      .cards {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .cards article {
        background: rgb(255 255 255 / 3.5%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 12px;
        padding: 22px;
      }

      .cards span {
        align-items: center;
        background: rgb(5 150 105 / 8%);
        border: 1px solid rgb(5 150 105 / 15%);
        border-radius: 8px;
        color: #34d399;
        display: flex;
        font-size: 13px;
        font-weight: 700;
        height: 36px;
        justify-content: center;
        margin-bottom: 14px;
        width: 36px;
      }

      .cards h3 {
        font-size: 15px;
        margin: 0 0 4px;
      }

      .cards p {
        color: rgb(255 255 255 / 45%);
        font-size: 13px;
        line-height: 1.5;
        margin: 0;
      }

      @media (max-width: 760px) {
        .nav-links a:not(.cta-btn) {
          display: none;
        }

        .hero {
          padding-top: 56px;
        }

        .quickstart div {
          overflow-x: auto;
        }

        .cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AppComponent {
  protected readonly remoteComponent = signal<Type<unknown> | null>(null);

  constructor() {
    void this.loadRemote();
  }

  private async loadRemote(): Promise<void> {
    const remote = await import('angular_remote/PromoCard');
    this.remoteComponent.set(remote.PromoCardComponent);
  }
}
