import { defineConfig } from 'tsdown'
import { withZephyr } from 'zephyr-rolldown-plugin'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    dts: true,
    plugins: [withZephyr()]
  },
])
