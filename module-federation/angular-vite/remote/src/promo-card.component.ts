import { Component } from '@angular/core';

@Component({
  selector: 'app-promo-card',
  standalone: true,
  template: `
    <article class="promo-card">
      <div class="eyebrow"><span></span>Remote · Angular 21</div>
      <h2>Federated starter card</h2>
      <p>
        This standalone Angular component is built by the remote Vite app and
        loaded by the host at runtime through Module Federation.
      </p>
      <dl>
        <div>
          <dt>Remote</dt>
          <dd>angular_remote</dd>
        </div>
        <div>
          <dt>Expose</dt>
          <dd>./PromoCard</dd>
        </div>
        <div>
          <dt>Entry</dt>
          <dd>remoteEntry.js</dd>
        </div>
      </dl>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .promo-card {
        background: linear-gradient(135deg, rgb(5 150 105 / 10%), rgb(5 150 105 / 4%));
        border: 1px solid rgb(5 150 105 / 20%);
        border-radius: 16px;
        box-shadow: 0 22px 60px rgb(0 0 0 / 28%);
        box-sizing: border-box;
        color: rgb(255 255 255 / 87%);
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        margin: 0 auto;
        max-width: 640px;
        padding: 32px;
      }

      .eyebrow {
        align-items: center;
        color: #34d399;
        display: flex;
        font-size: 12px;
        font-weight: 600;
        gap: 8px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .eyebrow span {
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

      h2 {
        font-size: clamp(28px, 5vw, 44px);
        letter-spacing: -0.03em;
        line-height: 1.05;
        margin: 16px 0 12px;
      }

      p {
        color: rgb(255 255 255 / 55%);
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
      }

      dl {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin: 28px 0 0;
      }

      dl > div {
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 10px;
        padding: 12px;
      }

      dt {
        color: rgb(255 255 255 / 42%);
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
      }

      dd {
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        margin: 4px 0 0;
        overflow-wrap: anywhere;
      }

      @media (max-width: 560px) {
        .promo-card {
          padding: 22px;
        }

        dl {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PromoCardComponent {}
