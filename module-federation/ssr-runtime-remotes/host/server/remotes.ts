/**
 * Decides which build of the product card remote renders a request, and loads
 * that build from Zephyr with the Module Federation runtime.
 *
 * The browser then loads the browser build of the same Zephyr version (see
 * src/entry-client.tsx), so the markup it hydrates always matches the server's.
 */
import { randomInt } from 'node:crypto';
import { createInstance } from '@module-federation/runtime';
import product from '../../remote/zephyr-deployment.json';
import {
  HOST_NAME,
  sharedReact,
  type ProductCardComponent,
  type ProductCardModule,
} from '../src/federation';
import { StaleCache } from './stale-cache';

export const DEFAULT_ZEPHYR_API = 'https://api.zephyr-cloud.io';
const DEFAULT_ALLOWED_HOSTS = 'zephyrcloud.app';
const RESOLVE_TTL_MS = 15_000;
const LOAD_TIMEOUT_MS = 10_000;
const MAX_LOADED_BUILDS = 4;

export type Cohort = 'stable' | 'candidate';

export interface RolloutConfig {
  /** Zephyr environment, tag, or semver range most visitors get. Unset = the pinned build. */
  REMOTE_SELECTOR?: string;
  /** A second selector for a canary, shown to CANDIDATE_PERCENT of visitors. */
  CANDIDATE_SELECTOR?: string;
  CANDIDATE_PERCENT?: string;
  /** Let `x-zephyr-preview: candidate` force the candidate cohort. */
  ALLOW_PREVIEW?: string;
  ZEPHYR_API?: string;
  /** Comma-separated hosts this server may run remote code from. */
  ALLOWED_REMOTE_HOSTS?: string;
}

export interface RemoteRelease {
  cohort: Cohort;
  /** How the build was chosen: "pinned build" or a Zephyr selector. */
  label: string;
  /** Immutable Zephyr origin of the build. */
  origin: string;
  ProductCard: ProductCardComponent;
}

/**
 * Every visitor gets a bucket from 0 to 99, kept in a cookie, so a canary at 10%
 * shows the candidate to the same 10% of visitors on every request.
 */
export function chooseCohort(
  headers: Headers,
  config: RolloutConfig
): { cohort: Cohort; setCookie?: string } {
  const saved = headers.get('cookie')?.match(/(?:^|;\s*)ze_bucket=(\d{1,2})(?:;|$)/)?.[1];
  const bucket = saved === undefined ? randomInt(100) : Number(saved);
  const setCookie =
    saved === undefined
      ? `ze_bucket=${bucket}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`
      : undefined;

  if (!config.CANDIDATE_SELECTOR) return { cohort: 'stable', setCookie };
  const preview =
    config.ALLOW_PREVIEW === 'true' && headers.get('x-zephyr-preview') === 'candidate';
  const inCanary = bucket < Number(config.CANDIDATE_PERCENT || 0);
  return { cohort: preview || inCanary ? 'candidate' : 'stable', setCookie };
}

/**
 * The product card build for a cohort. A candidate that can't be resolved or
 * loaded falls back to stable, so a broken release never takes the page down.
 */
export async function getRelease(cohort: Cohort, config: RolloutConfig): Promise<RemoteRelease> {
  if (cohort === 'candidate' && config.CANDIDATE_SELECTOR) {
    try {
      return await loadRelease('candidate', config.CANDIDATE_SELECTOR, config);
    } catch (error) {
      console.warn(`Candidate "${config.CANDIDATE_SELECTOR}" unavailable, serving stable:`, error);
    }
  }
  return loadRelease('stable', config.REMOTE_SELECTOR, config);
}

const pinnedOrigin = new URL(product.url).origin;
const releases = new StaleCache<{ origin: string; ProductCard: ProductCardComponent }>(
  RESOLVE_TTL_MS
);

async function loadRelease(
  cohort: Cohort,
  selector: string | undefined,
  config: RolloutConfig
): Promise<RemoteRelease> {
  if (!selector) {
    // Lockstep: the remote build this host was built and tested with.
    const ProductCard = await loadBuild(pinnedOrigin, config);
    return { cohort, label: 'pinned build', origin: pinnedOrigin, ProductCard };
  }

  // Re-resolved every 15 seconds, so a release or rollback in Zephyr reaches this
  // server without a deploy. If Zephyr is unreachable, or the build it now points
  // to fails to load, the last build that worked keeps serving.
  const { origin, ProductCard } = await releases.get(selector, async () => {
    const origin = await resolveSelector(selector, config.ZEPHYR_API || DEFAULT_ZEPHYR_API);
    return { origin, ProductCard: await loadBuild(origin, config) };
  });
  return { cohort, label: selector, origin, ProductCard };
}

/**
 * Zephyr's public resolver is the same endpoint the bundler plugins use for
 * `zephyr:dependencies`. `url_mode=version` returns the immutable version URL
 * behind an environment, tag, or semver range.
 */
async function resolveSelector(selector: string, apiBase: string): Promise<string> {
  const url = new URL('/v2/builder-public-api/resolve', apiBase);
  url.searchParams.set('name', product.applicationUid);
  url.searchParams.set('version', selector);
  url.searchParams.set('url_mode', 'version');

  // A hanging connection should count as a failure, not hold a refresh open.
  const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
  if (!response.ok) {
    throw new Error(`Zephyr could not resolve ${product.applicationUid}@${selector}: ${response.status}`);
  }

  const { value } = (await response.json()) as { value: { default_url: string | null } | null };
  if (!value?.default_url) {
    throw new Error(`Zephyr returned no URL for ${product.applicationUid}@${selector}`);
  }
  return new URL(value.default_url).origin;
}

// One federation runtime for the whole server, with the host's React shared.
const federation = createInstance({ name: HOST_NAME, remotes: [], shared: sharedReact });
const builds = new Map<string, Promise<ProductCardComponent>>();
let previousLoad: Promise<unknown> = Promise.resolve();

/**
 * Loads `product/ProductCard` from one build's Node container. A build never
 * changes, so each one loads once and every request after that reuses it.
 */
function loadBuild(origin: string, config: RolloutConfig): Promise<ProductCardComponent> {
  let build = builds.get(origin);
  if (!build) {
    assertAllowedOrigin(origin, config.ALLOWED_REMOTE_HOSTS || DEFAULT_ALLOWED_HOSTS);
    // The runtime tracks a remote by name, so builds of `product` load one at a time.
    const load = previousLoad.then(() => importProductCard(origin));
    previousLoad = load.catch(() => undefined);
    // Never cache a failure: the next request should retry.
    load.catch(() => {
      if (builds.get(origin) === load) builds.delete(origin);
    });
    builds.set(origin, load);
    // Keep memory bounded on long-running servers: drop the build loaded first.
    if (builds.size > MAX_LOADED_BUILDS) builds.delete(builds.keys().next().value!);
    build = load;
  }
  // A hanging request to Zephyr must not hang the page. The load keeps going in
  // the background, and a later request picks it up.
  return withTimeout(build, LOAD_TIMEOUT_MS);
}

async function importProductCard(origin: string): Promise<ProductCardComponent> {
  // Point `product` at this build. `force` replaces the build loaded before it;
  // components already loaded from that build keep rendering.
  federation.registerRemotes([{ name: 'product', entry: `${origin}/server/mf-manifest.json` }], {
    force: true,
  });
  const module = await federation.loadRemote<ProductCardModule>('product/ProductCard');
  if (!module) throw new Error(`product/ProductCard is missing from ${origin}`);
  return module.default;
}

/** The server runs whatever code it loads, so only load it from hosts you trust. */
function assertAllowedOrigin(origin: string, allowedHosts: string) {
  const { protocol, hostname } = new URL(origin);
  const allowed = allowedHosts.split(',').map((host) => host.trim());
  if (
    protocol !== 'https:' ||
    !allowed.some((host) => host && (hostname === host || hostname.endsWith(`.${host}`)))
  ) {
    throw new Error(`Refusing to load remote code from ${origin}: not in ALLOWED_REMOTE_HOSTS`);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_resolve, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms).unref();
    }),
  ]);
}
