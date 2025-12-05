import { defineConfig } from 'rolldown';
import { withZephyr } from 'zephyr-rolldown-plugin';

export default defineConfig({
  input: 'src/main.tsx',
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
        `;
        this.emitFile({
          type: 'asset',
          fileName: 'index.html',
          source: html,
        });
      },
    },
    withZephyr(),
  ],
});
