import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { RENDER_INFO_ID, type RenderInfo } from '../src/render-info';
import { chooseCohort, getRelease, type RemoteRelease, type RolloutConfig } from './remotes';
import host from './zephyr-deployment.json';
import { getShell, renderIntoShell } from './zephyr-shell';

export interface RenderConfig extends RolloutConfig {
  /** Shown on the page, e.g. "Fastify on Node.js v24.11.0". */
  RUNTIME: string;
}

// This host's own client build, pinned at build time as in `ssr-release-pinning`:
// deploying the server releases the host. The remote releases through Zephyr.
const hostOrigin = new URL(host.url).origin;

/** Renders one page from a standard Request, returning a standard Response. */
export async function renderPage(request: Request, config: RenderConfig): Promise<Response> {
  const url = new URL(request.url);
  const headers = new Headers({ 'x-zephyr-origin': hostOrigin });
  try {
    // Files live on Zephyr: send any path with an extension to the host's build.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) {
      headers.set('location', `${hostOrigin}${url.pathname}${url.search}`);
      return new Response(null, { status: 302, headers });
    }

    const { cohort, setCookie } = chooseCohort(request.headers, config);
    if (setCookie) headers.append('set-cookie', setCookie);
    // The page differs per cohort, so a shared cache must never serve it to others.
    headers.set('cache-control', 'private, no-store');

    const [shell, release] = await Promise.all([
      getShell(hostOrigin),
      // Without the remote the page still renders, just without the product card.
      getRelease(cohort, config).catch((error: unknown): RemoteRelease | null => {
        console.error('Product card unavailable:', error);
        return null;
      }),
    ]);
    // Every response says which build rendered it, so logs can compare cohorts.
    headers.set('x-zephyr-cohort', release?.cohort ?? 'none');
    if (release) headers.set('x-zephyr-remote-origin', release.origin);

    const info: RenderInfo = {
      runtime: config.RUNTIME,
      cohort: release?.cohort ?? null,
      release: release?.label ?? 'unavailable',
      remoteOrigin: release?.origin ?? null,
      renderedAt: new Date().toISOString(),
      path: url.pathname,
    };

    const appHtml = renderToString(<App info={info} ProductCard={release?.ProductCard ?? null} />);
    headers.set('content-type', 'text/html; charset=utf-8');
    return new Response(renderIntoShell(shell, appHtml, RENDER_INFO_ID, info), { headers });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`SSR failed: ${message}`, { status: 502, headers });
  }
}
