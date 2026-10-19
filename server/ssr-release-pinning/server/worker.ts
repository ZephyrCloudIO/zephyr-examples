// Cloudflare Workers entry. Configuration comes from `vars` in wrangler.jsonc.
import { renderPage, type RenderConfig } from './render';

export default {
  fetch(request: Request, env: Omit<RenderConfig, 'RUNTIME'>) {
    return renderPage(new URL(request.url), { ...env, RUNTIME: 'Cloudflare Workers' });
  },
};
