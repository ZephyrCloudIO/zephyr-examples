import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { withZephyr } from 'vite-plugin-zephyr'
import { registerDeployment } from './scripts/register-deploy'

/**
 * Vite config is evaluated by Node AFTER the prebuild step runs. The prebuild
 * (`scripts/near-auth-gate.ts`) renders two dot-files in project root:
 *   .manifest-hash   — sha256 of git HEAD + package identifier
 *   .zephyr-tmp-token — the ZE_SERVER_TOKEN released from the OutLayer TEE
 *                       via the DeployRegistry contract callback log
 *
 * Both are produced only after a valid NEAR signature + on-chain authorization.
 * The token is loaded into `process.env.ZE_SERVER_TOKEN` so the zephyr-agent
 * upload (in writeBundle) gates on it. Without it, Zephyr refuses the upload.
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
  console.log('[vite.config] ZE_SERVER_TOKEN sourced from NEAR-gated OutLayer TEE')
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