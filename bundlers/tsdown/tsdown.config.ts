import { defineConfig } from 'tsdown'
import { withZephyr } from 'zephyr-rolldown-plugin'

function withZephyrRelativeAssetPaths() {
  const zephyr = withZephyr()

  return {
    ...zephyr,
    writeBundle(options, bundle) {
      if (!zephyr.writeBundle) return
      return zephyr.writeBundle.call(this, { ...options, dir: '' }, bundle)
    }
  }
}

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    dts: true
  },
  {
    entry: ['./src/main.tsx'],
    platform: 'browser',
    dts: false,
    clean: false,
    env: {
      NODE_ENV: 'production'
    },
    plugins: [
      {
        name: 'emit-html',
        generateBundle() {
          const html = `
            <html>
              <body>
                <div id="root"></div>
                <script type="module" src="./main.js"></script>
              </body>
            </html>
          `

          this.emitFile({
            type: 'asset',
            fileName: 'index.html',
            source: html,
          })
        },
      },
      withZephyrRelativeAssetPaths()
    ]
  }
])
