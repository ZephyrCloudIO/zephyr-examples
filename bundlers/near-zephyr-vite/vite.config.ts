import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { withZephyr } from 'vite-plugin-zephyr'
import { registerDeployment } from './scripts/register-deploy'

/**
 * Vite config is evaluated by Node AFTER the prebuild step runs. The prebuild
 * (`scripts/auth.ts`) renders two dot-files in project root:
 *   .manifest-hash   — sha256 of git HEAD + package identifier
 *   .zephyr-tmp-token — ZE_SERVER_TOKEN issued by the near-zephyr-proxy
 *                        after verifying the NEP-413 NEAR signature
 *
 * Both are produced only after a valid NEAR signature + on-chain authorization
 * check. The token is loaded into `process.env.ZE_SERVER_TOKEN` so the
 * zephyr-agent upload gates on it.
 */
const root = path.resolve(import.meta.dirname)
function readOptional(p: string): string {
  try {
    return readFileSync(p, 'utf8').trim()
  } catch {
    return ''
  }
}
const tokenPath = path.join(root, '.zephyr-tmp-token')
const token = readOptional(tokenPath)
if (token) {
  process.env.ZE_SERVER_TOKEN = token
  console.log('[vite.config] ZE_SERVER_TOKEN sourced from NEP-413 auth proxy')
} else {
  console.warn(
    '[vite.config] no .zephyr-tmp-token — `pnpm prebuild` must run first (build script chains them).',
  )
}
const manifestHash = readOptional(path.join(root, '.manifest-hash'))

export default defineConfig({
  plugins: [
    react(),
    ...withZephyr({
      hooks: {
        onDeployComplete: async (info) => {
          try {
            await registerDeployment({
              snapshotId: info.snapshot.snapshot_id ?? '',
              url: info.url,
              manifestHash,
            })
          } catch (err) {
            console.error('[zephyr] registerDeployment failed:', err)
          }
        },
      },
    }),
  ],
})