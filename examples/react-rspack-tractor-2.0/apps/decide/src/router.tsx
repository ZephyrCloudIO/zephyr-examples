import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';

const ProductPage = lazy(() => import('./ProductPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', paddingBottom: '2rem' }}
        data-boundary-page="decide">
        <h1>Decide Remote - Tractor Sample 2.0</h1>
        <h2>Exported Pages</h2>
        <Link to="/product/AU-01">Product Page</Link>
      </div>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <Suspense fallback={'Loading...'}>
        <ProductPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1em',
          paddingBottom: '2rem',
          textAlign: 'center',
        }}
        data-boundary-page="decide">
        <h1>Decide Remote - Tractor Sample 2.0</h1>
        <h2>404 - Page not found</h2>
        <h3>The page you are looking for might be on other remote.</h3>
        <Link to="/">Back to Home</Link>
      </div>
    ),
  },
]);
