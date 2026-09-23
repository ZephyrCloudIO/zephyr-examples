import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Compute the build "manifest hash" before the Vite build runs.
 *
 * It must be stable across the prebuild step (sets `process.env.ZE_SERVER_TOKEN`)
 * and the `onDeployComplete` hook (registers finalization on the NEAR
 * contract). The hash is derived from:
 *   - git HEAD commit (or "nogit" if uncommitted)
 *   - the package.json `name@version`
 *
 * It is NOT a hash of the build output (dist/) — dist doesn't exist when
 * the prebuild gate runs. The git commit + package identity is sufficient
 * provenance for the demo: each deploy is tied to a specific git state +
 * project revision.
 *
 * The hash is persisted to `.manifest-hash` in the project root so vite.config.ts
 * (evaluated after prebuild) can read it back during the `onDeployComplete`
 * hook call.
 */

const projectRoot = path.resolve(import.meta.dirname, '..')

/**
 * Pure hash function — exposed for unit testing without git/fs dependencies.
 * The same logic `computeManifestHash` uses internally.
 */
export function hashManifest(gitHead: string, packageName: string, packageVersion: string): string {
  return createHash('sha256')
    .update(`${gitHead}\n${packageName}@${packageVersion}\n`)
    .digest('hex')
}

export function computeManifestHash(): string {
  let head = 'nogit'
  try {
    head = execSync('git rev-parse HEAD', { cwd: projectRoot, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    // not a git repo or git missing
  }
  const pkg = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8')) as {
    name: string
    version: string
  }
  return hashManifest(head, pkg.name, pkg.version)
}

export function manifestHashFile(): string {
  return path.join(projectRoot, '.manifest-hash')
}