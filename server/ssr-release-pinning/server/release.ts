/**
 * Decides which Zephyr deployment serves the client for a request, and whether
 * this server can safely server-render it.
 */
import { StaleCache } from './stale-cache';
import pinned from './zephyr-deployment.json';

export const DEFAULT_ZEPHYR_API = 'https://api.zephyr-cloud.io';
const RESOLVE_TTL_MS = 15_000;

export interface Release {
  /** Origin of the client build to use for this request. */
  origin: string;
  /** Human-readable description, e.g. "production" or "pinned build". */
  label: string;
  /**
   * True when the selected build is the one this server was built with. Only then
   * does server markup match what the browser's JavaScript will render.
   */
  matchesServer: boolean;
}

const pinnedOrigin = new URL(pinned.url).origin;
const resolutions = new StaleCache<string>(RESOLVE_TTL_MS);

/**
 * Without a selector the server renders against the client build it was built with
 * (lockstep). With a selector such as `production`, a tag name, or a semver range,
 * Zephyr decides, so a release or rollback in Zephyr changes what users get.
 */
export async function resolveRelease(
  selector: string | undefined,
  apiBase = DEFAULT_ZEPHYR_API
): Promise<Release> {
  if (!selector) {
    return { origin: pinnedOrigin, label: 'pinned build', matchesServer: true };
  }

  // Re-resolved every 15 seconds. If the API can't be reached, the last build
  // resolved for this selector keeps serving, so an outage doesn't take the site down.
  const origin = await resolutions.get(selector, () => fetchResolution(selector, apiBase));
  return { origin, label: selector, matchesServer: origin === pinnedOrigin };
}

/**
 * Zephyr's public resolver is the same endpoint the bundler plugins use for
 * `zephyr:dependencies`. `url_mode=version` returns the immutable version URL
 * behind an environment or tag, which is what makes the build comparable to ours.
 */
async function fetchResolution(selector: string, apiBase: string): Promise<string> {
  const url = new URL('/v2/builder-public-api/resolve', apiBase);
  url.searchParams.set('name', pinned.applicationUid);
  url.searchParams.set('version', selector);
  url.searchParams.set('url_mode', 'version');

  // A hanging connection should count as a failure, not hold a refresh open.
  const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
  if (!response.ok) {
    throw new Error(
      `Zephyr could not resolve ${pinned.applicationUid}@${selector}: ${response.status}`
    );
  }

  const { value } = (await response.json()) as { value: { default_url: string | null } | null };
  if (!value?.default_url) {
    throw new Error(`Zephyr returned no URL for ${pinned.applicationUid}@${selector}`);
  }
  return new URL(value.default_url).origin;
}
