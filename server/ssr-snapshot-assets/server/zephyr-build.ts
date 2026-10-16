/**
 * Reads what a Zephyr deployment contains straight from the Zephyr edge, using
 * three public endpoints every Zephyr URL answers:
 *
 *   /__get_version_info__     which snapshot this (possibly mutable) URL serves
 *   /__get_zephyr_snapshot__  the snapshot's application and full asset list
 *   /.vite/manifest.json      Vite's map from entry to hashed JS/CSS files
 */
import { StaleCache } from './stale-cache';

const VERSION_TTL_MS = 10_000;
const MAX_CACHED_BUILDS = 20;

export interface ZephyrBuild {
  snapshotId: string;
  /** Immutable origin of this exact snapshot. Every asset URL points here. */
  versionOrigin: string;
  entry: string;
  css: string[];
  modulePreloads: string[];
  /** Import map for Zephyr runtime environment variables. */
  importMap: Record<string, string>;
}

interface VersionInfo {
  snapshot_id: string;
  version_url: string;
}

interface ViteManifestChunk {
  file: string;
  isEntry?: boolean;
  css?: string[];
  imports?: string[];
}

const live = new StaleCache<ZephyrBuild>(VERSION_TTL_MS);
const builds = new Map<string, Promise<ZephyrBuild>>();

/**
 * Environment and tag URLs change what they serve on every release, so we keep
 * asking which snapshot is live (every few seconds), and keep rendering the last
 * good build if Zephyr can't be reached. Everything about a snapshot is immutable,
 * so it is fetched once and kept.
 */
export function getBuild(zephyrUrl: string): Promise<ZephyrBuild> {
  const { origin, protocol } = new URL(zephyrUrl);
  return live.get(origin, async () => {
    const { snapshot_id, version_url } = await fetchJson<VersionInfo>(
      `${origin}/__get_version_info__`
    );
    return getSnapshotBuild(origin, `${protocol}//${version_url}`, snapshot_id);
  });
}

function getSnapshotBuild(
  requestedOrigin: string,
  versionOrigin: string,
  snapshotId: string
): Promise<ZephyrBuild> {
  // The import map points at the requested URL, so the key includes it.
  const key = `${requestedOrigin} ${snapshotId}`;
  let build = builds.get(key);
  if (!build) {
    build = loadBuild(requestedOrigin, versionOrigin, snapshotId);
    builds.set(key, build);
    build.catch(() => builds.delete(key));
    // Keep memory bounded on long-running servers: drop the oldest snapshot.
    if (builds.size > MAX_CACHED_BUILDS) {
      builds.delete(builds.keys().next().value!);
    }
  }
  return build;
}

async function loadBuild(
  requestedOrigin: string,
  versionOrigin: string,
  snapshotId: string
): Promise<ZephyrBuild> {
  const snapshot = await fetchJson<{ application_uid: string; assets: Record<string, unknown> }>(
    `${versionOrigin}/__get_zephyr_snapshot__`
  );
  if (!snapshot.assets['.vite/manifest.json']) {
    throw new Error(
      `Snapshot ${snapshotId} has no .vite/manifest.json. Set build.manifest: true in vite.config.ts.`
    );
  }

  const manifest = await fetchJson<Record<string, ViteManifestChunk>>(
    `${versionOrigin}/.vite/manifest.json`
  );
  const entry = manifest['index.html'] ?? Object.values(manifest).find((chunk) => chunk.isEntry);
  if (!entry) {
    throw new Error(`No entry chunk in the Vite manifest of snapshot ${snapshotId}`);
  }

  // Walk the entry's static imports for preloads and the CSS they pull in.
  const css = new Set(entry.css);
  const modulePreloads = new Set<string>();
  const pending = [...(entry.imports ?? [])];
  for (let key = pending.pop(); key; key = pending.pop()) {
    const chunk = manifest[key];
    if (!chunk || modulePreloads.has(chunk.file)) continue;
    modulePreloads.add(chunk.file);
    chunk.css?.forEach((file) => css.add(file));
    pending.push(...(chunk.imports ?? []));
  }

  const toUrl = (file: string) => `${versionOrigin}/${file}`;
  return {
    snapshotId,
    versionOrigin,
    entry: toUrl(entry.file),
    css: [...css].map(toUrl),
    modulePreloads: [...modulePreloads].map(toUrl),
    // Zephyr stores environment variables per environment, so this points at the
    // URL that was requested (e.g. production), not at the immutable version.
    importMap: {
      [`env:vars:${snapshot.application_uid}`]: `${requestedOrigin}/zephyr-manifest.json`,
    },
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    // A hanging connection should count as a failure, not hold a refresh open.
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`Zephyr request failed: ${response.status} ${url}`);
  }
  return (await response.json()) as T;
}
