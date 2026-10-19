/** Id of the `<script type="application/json">` that hands server props to the browser. */
export const RENDER_INFO_ID = '__render_info__';

/**
 * Everything the server knew while rendering. The browser hydrates with the exact
 * same object, otherwise React would see different markup and throw away the SSR
 * output.
 */
export interface RenderInfo {
  /** Where the HTML was produced, e.g. "Node.js v24.11.0" or "Cloudflare Workers". */
  runtime: string;
  /** Immutable origin of the Zephyr snapshot serving the JS/CSS for this page. */
  zephyrOrigin: string;
  /** Zephyr snapshot the page was rendered against. */
  snapshotId: string;
  /** ISO timestamp of the render. */
  renderedAt: string;
  path: string;
}
