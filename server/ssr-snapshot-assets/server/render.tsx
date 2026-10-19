import { renderToReadableStream } from 'react-dom/server';
import type { RenderInfo } from '../src/render-info';
import { Document } from './document';
import { getBuild } from './zephyr-build';

export interface RenderConfig {
  /** Any URL of the Zephyr deployment to render against, e.g. an environment URL. */
  ZEPHYR_URL?: string;
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
    const build = await getBuild(zephyrUrl(config));
    headers.set('x-zephyr-snapshot', build.snapshotId);

    // Files live on Zephyr: send any path with an extension to this exact snapshot.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) {
      headers.set('location', `${build.versionOrigin}${url.pathname}${url.search}`);
      return new Response(null, { status: 302, headers });
    }

    const info: RenderInfo = {
      runtime: config.RUNTIME,
      zephyrOrigin: build.versionOrigin,
      snapshotId: build.snapshotId,
      renderedAt: new Date().toISOString(),
      path: url.pathname,
    };

    // Streams HTML as React produces it. The same API exists on Node and Workers.
    const stream = await renderToReadableStream(<Document build={build} info={info} />, {
      bootstrapModules: [build.entry],
      // Import maps must precede every module load, including preloads.
      importMap: { imports: build.importMap },
      onError(error) {
        console.error(error);
      },
    });

    headers.set('content-type', 'text/html; charset=utf-8');
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`SSR failed: ${message}`, { status: 502, headers });
  }
}

function zephyrUrl(config: RenderConfig): string {
  if (!config.ZEPHYR_URL) {
    throw new Error('ZEPHYR_URL is not set. Run `pnpm build:client` and copy the URL it prints.');
  }
  return config.ZEPHYR_URL;
}
