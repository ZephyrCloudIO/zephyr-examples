/** Id of the `<script type="application/json">` that hands server props to the browser. */
export const RENDER_INFO_ID = '__render_info__';

/**
 * Everything the server knew while rendering. The browser hydrates with the exact
 * same object, otherwise React would see different markup and throw away the SSR
 * output.
 */
export interface RenderInfo {
  /** Where the HTML was produced, e.g. "Fastify on Node.js v24.11.0". */
  runtime: string;
  /** Rollout cohort that picked the product card build, or null without a server. */
  cohort: 'stable' | 'candidate' | null;
  /** How that build was chosen: "pinned build" or a Zephyr selector. */
  release: string;
  /**
   * Immutable Zephyr origin of the product card build on this page. The browser
   * loads this exact build, so it renders the same markup the server did. Null
   * when the server could not load the remote.
   */
  remoteOrigin: string | null;
  /** ISO timestamp of the render. */
  renderedAt: string;
  path: string;
}
