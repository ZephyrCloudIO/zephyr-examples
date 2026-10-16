/**
 * The Zephyr edge already serves a production `index.html` for every deployment:
 * hashed `<script>`/`<link>` tags from the Vite build, plus an import map Zephyr
 * injects for runtime environment variables. We reuse it as the SSR template, so
 * the server never needs to know which hashed files a build produced.
 */
import { StaleCache } from './stale-cache';

const ROOT_PLACEHOLDER = /<div id="root">\s*<\/div>/;
const SHELL_TTL_MS = 10_000;

const shells = new StaleCache<string>(SHELL_TTL_MS);

/**
 * Returns the deployment's HTML shell with every root-relative URL pointing at the
 * Zephyr origin. Refreshed every 10 seconds, so a release reaches the server within
 * seconds when `ZEPHYR_URL` is an environment URL. If Zephyr can't be reached, the
 * last good shell keeps rendering.
 */
export function getShell(zephyrOrigin: string): Promise<string> {
  return shells.get(zephyrOrigin, () => fetchShell(zephyrOrigin));
}

async function fetchShell(zephyrOrigin: string): Promise<string> {
  const response = await fetch(`${zephyrOrigin}/`, {
    headers: { accept: 'text/html' },
    // A hanging connection should count as a failure, not hold a refresh open.
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`Zephyr shell request failed: ${response.status} ${zephyrOrigin}/`);
  }

  const html = await response.text();
  if (!ROOT_PLACEHOLDER.test(html)) {
    throw new Error(`No empty <div id="root"></div> found in the shell at ${zephyrOrigin}/`);
  }

  return absolutizeUrls(html, zephyrOrigin);
}

/**
 * The page is served from our server's origin, but the files live on Zephyr. Point
 * root-relative `src`/`href` attributes and import map entries at the Zephyr origin.
 * Zephyr serves assets with `Access-Control-Allow-Origin: *`, so cross-origin
 * module scripts load fine.
 */
export function absolutizeUrls(html: string, zephyrOrigin: string): string {
  const withAttributes = html.replace(
    /(\s(?:src|href)=["'])\/(?!\/)/g,
    `$1${zephyrOrigin}/`
  );

  // Zephyr maps `env:vars:<application_uid>` to `/zephyr-manifest.json`.
  return withAttributes.replace(
    /(<script[^>]*type=["']?importmap["']?[^>]*>)([\s\S]*?)(<\/script>)/i,
    (_match, open: string, json: string, close: string) => {
      const importMap = JSON.parse(json) as { imports?: Record<string, string> };
      for (const [specifier, url] of Object.entries(importMap.imports ?? {})) {
        if (url.startsWith('/') && !url.startsWith('//')) {
          importMap.imports![specifier] = `${zephyrOrigin}${url}`;
        }
      }
      return `${open}${JSON.stringify(importMap)}${close}`;
    }
  );
}

/** Puts the rendered markup and the props the browser needs to hydrate into the shell. */
export function renderIntoShell(
  shell: string,
  appHtml: string,
  scriptId: string,
  data: unknown
): string {
  // `<` is escaped so data can never close the script tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return shell.replace(
    ROOT_PLACEHOLDER,
    `<div id="root">${appHtml}</div><script id="${scriptId}" type="application/json">${json}</script>`
  );
}
