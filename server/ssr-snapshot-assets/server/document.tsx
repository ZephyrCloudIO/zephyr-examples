import { App } from '../src/App';
import { RENDER_INFO_ID, type RenderInfo } from '../src/render-info';
import type { ZephyrBuild } from './zephyr-build';

/**
 * The full page, rendered by React on the server. Only `#root` is hydrated in the
 * browser; everything else is plain markup pointing at the Zephyr build. The entry
 * script and the import map are added by `renderToReadableStream`, which places the
 * map ahead of the module preloads React emits for the entry.
 */
export function Document({ build, info }: { build: ZephyrBuild; info: RenderInfo }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Zephyr SSR · Snapshot assets</title>
        <link rel="icon" type="image/svg+xml" href={`${build.versionOrigin}/zephyr.svg`} />
        {build.css.map((href) => (
          <link key={href} rel="stylesheet" href={href} crossOrigin="" />
        ))}
        {build.modulePreloads.map((href) => (
          <link key={href} rel="modulepreload" href={href} crossOrigin="" />
        ))}
      </head>
      <body>
        <div id="root">
          <App info={info} />
        </div>
        <script
          id={RENDER_INFO_ID}
          type="application/json"
          // `<` is escaped so data can never close the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(info).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
