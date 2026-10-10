import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';

// Standalone preview of the remote. It mirrors the paths the host mounts
// these components at, so the same Links work in both places. Hash history
// keeps deep links working when the remote is served from a CDN path.
const rootRoute = createRootRoute({
  component: () => (
    <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Catalog remote</h1>
      <p>Running standalone. The host app renders these same components inside its own router.</p>
      <Outlet />
    </main>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/products' });
  },
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductList,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: function ProductRoute() {
    const { productId } = productRoute.useParams();
    return <ProductDetail productId={productId} />;
  },
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, productsRoute, productRoute]),
  history: createHashHistory(),
});

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
