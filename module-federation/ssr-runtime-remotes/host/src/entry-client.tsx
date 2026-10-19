import { createInstance } from '@module-federation/runtime';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { HOST_NAME, sharedReact, type ProductCardModule } from './federation';
import { RENDER_INFO_ID, type RenderInfo } from './render-info';
// Styles are imported here, not in App.tsx, so server code never imports CSS.
import './index.css';

declare const __PRODUCT_REMOTE_URL__: string;

const root = document.getElementById('root')!;
const serialized = document.getElementById(RENDER_INFO_ID)?.textContent;

/** Loads `product/ProductCard` from the browser build of one exact remote build. */
async function loadProductCard(remoteOrigin: string) {
  const federation = createInstance({
    name: HOST_NAME,
    remotes: [{ name: 'product', entry: `${remoteOrigin}/mf-manifest.json` }],
    shared: sharedReact,
  });
  const module = await federation.loadRemote<ProductCardModule>('product/ProductCard');
  if (!module) throw new Error(`product/ProductCard is missing from ${remoteOrigin}`);
  return module.default;
}

async function start() {
  if (serialized) {
    // Served by our SSR server: load the product card build the server rendered,
    // then adopt the existing markup.
    const info = JSON.parse(serialized) as RenderInfo;
    const ProductCard = info.remoteOrigin ? await loadProductCard(info.remoteOrigin) : null;
    hydrateRoot(
      root,
      <StrictMode>
        <App info={info} ProductCard={ProductCard} />
      </StrictMode>
    );
  } else {
    // Opened straight from the Zephyr URL: render in the browser, with the product
    // card build this host was built with.
    const info: RenderInfo = {
      runtime: 'Browser only (no server render)',
      cohort: null,
      release: 'build-time version',
      remoteOrigin: __PRODUCT_REMOTE_URL__,
      renderedAt: new Date().toISOString(),
      path: location.pathname,
    };
    const ProductCard = await loadProductCard(__PRODUCT_REMOTE_URL__);
    createRoot(root).render(
      <StrictMode>
        <App info={info} ProductCard={ProductCard} />
      </StrictMode>
    );
  }
}

// If the remote can't load, the server-rendered page stays as it is, just not
// interactive.
start().catch((error: unknown) => console.error('Could not start the page:', error));
