import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { RENDER_INFO_ID, type RenderInfo } from '../src/render-info';
import { resolveRelease } from './release';
import { getShell, renderIntoShell } from './zephyr-shell';

export interface RenderConfig {
  /** Zephyr environment, tag, or semver range to follow. Unset = pinned build. */
  ZEPHYR_SELECTOR?: string;
  /** Allow `?zephyr=<selector>` to preview another tag or environment. */
  ZEPHYR_ALLOW_OVERRIDE?: string;
  ZEPHYR_API?: string;
  /** Shown on the page, e.g. "Node.js v24.11.0" or "Cloudflare Workers". */
  RUNTIME: string;
}

/**
 * Renders one page with standard Fetch API types only, so the same code runs in
 * the Fastify server (AWS) and the Cloudflare Worker.
 */
export async function renderPage(url: URL, config: RenderConfig): Promise<Response> {
  const headers = new Headers();
  try {
    const override =
      config.ZEPHYR_ALLOW_OVERRIDE === 'true' ? url.searchParams.get('zephyr') : null;
    const release = await resolveRelease(override || config.ZEPHYR_SELECTOR, config.ZEPHYR_API);
    headers.set('x-zephyr-origin', release.origin);

    // Files live on Zephyr: send any path with an extension to the selected build.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) {
      headers.set('location', `${release.origin}${url.pathname}${url.search}`);
      return new Response(null, { status: 302, headers });
    }

    const shell = await getShell(release.origin);
    headers.set('content-type', 'text/html; charset=utf-8');

    if (!release.matchesServer) {
      // Zephyr selected a client build this server was not built with, e.g. right
      // after a release and before the server redeploys. Its JavaScript may render
      // different markup, so skip SSR and let the browser render the shell.
      headers.set('x-zephyr-render', 'csr');
      return new Response(shell, { headers });
    }

    const info: RenderInfo = {
      runtime: config.RUNTIME,
      zephyrOrigin: release.origin,
      release: release.label,
      renderedAt: new Date().toISOString(),
      path: url.pathname,
    };

    headers.set('x-zephyr-render', 'ssr');
    const appHtml = renderToString(<App info={info} />);
    return new Response(renderIntoShell(shell, appHtml, RENDER_INFO_ID, info), { headers });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`SSR failed: ${message}`, { status: 502, headers });
  }
}
