// Cloudflare Workers entry. `ZEPHYR_URL` comes from `vars` in wrangler.jsonc.
import { renderPage } from './render';

export default {
  fetch(request: Request, env: { ZEPHYR_URL?: string }) {
    return renderPage(new URL(request.url), { ...env, RUNTIME: 'Cloudflare Workers' });
  },
};
