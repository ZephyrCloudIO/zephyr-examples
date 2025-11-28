// rspress.config.ts
import path from 'node:path';
import { defineConfig } from 'rspress/config';
import { withZephyr } from 'zephyr-rspress-plugin';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  outDir: './doc_build',
  ssg: true,
  builderPlugins: [],
  plugins: [withZephyr()],
});
