import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { RENDER_INFO_ID, type RenderInfo } from '../src/render-info';
import { getShell, renderIntoShell } from './zephyr-shell';

export interface RenderConfig {
  /** Any URL of the Zephyr deployment to render against, e.g. an environment URL. */
  ZEPHYR_URL?: string;
  /** Shown on the page, e.g. "Node.js v24.11.0" or "Cloudflare Workers". */
  RUNTIME: string;
}

/**
 * Renders one page with standard Fetch API types only, so the same code runs in
 * the Fastify server (AWS) and the Cloudflare Worker. Each entry just adapts its
 * request to a URL and sends the Response back.
 */
export async function renderPage(url: URL, config: RenderConfig): Promise<Response> {
  const headers = new Headers();
  try {
    const origin = zephyrOrigin(config);
    // Says which Zephyr deployment served the response, even when rendering fails.
    headers.set('x-zephyr-origin', origin);

    // Files live on Zephyr. A path with an extension that reaches this server (the
    // browser's automatic /favicon.ico request, for example) is sent to the edge.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) {
      headers.set('location', `${origin}${url.pathname}${url.search}`);
      return new Response(null, { status: 302, headers });
    }

    const shell = await getShell(origin);
    const info: RenderInfo = {
      runtime: config.RUNTIME,
      zephyrOrigin: origin,
      renderedAt: new Date().toISOString(),
      path: url.pathname,
    };

    const appHtml = renderToString(<App info={info} />);
    headers.set('content-type', 'text/html; charset=utf-8');
    return new Response(renderIntoShell(shell, appHtml, RENDER_INFO_ID, info), { headers });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`SSR failed: ${message}`, { status: 502, headers });
  }
}

function zephyrOrigin(config: RenderConfig): string {
  if (!config.ZEPHYR_URL) {
    throw new Error('ZEPHYR_URL is not set. Run `pnpm build:client` and copy the URL it prints.');
  }
  return new URL(config.ZEPHYR_URL).origin;
}
