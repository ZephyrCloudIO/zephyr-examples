import type { UserOptions } from '@module-federation/runtime/types';
import type { ComponentType } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

/** What this host expects `product/ProductCard` to be. The remote owns the implementation. */
export type ProductCardComponent = ComponentType<{ name: string; price: string }>;

export type ProductCardModule = { default: ProductCardComponent };

/** Name of this host's federation runtime, on the server and in the browser. */
export const HOST_NAME = 'ssr_runtime_remotes_host';

/**
 * The host's React, shared as a singleton: remote components render with this
 * copy, on the server and in the browser, so hooks work across the boundary.
 */
export const sharedReact: UserOptions['shared'] = {
  react: {
    version: React.version,
    lib: () => React,
    shareConfig: { singleton: true, requiredVersion: false },
  },
  'react-dom': {
    version: ReactDOM.version,
    lib: () => ReactDOM,
    shareConfig: { singleton: true, requiredVersion: false },
  },
};
