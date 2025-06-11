import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';

const HomePage = lazy(() => import('./HomePage'));
const CategoryPage = lazy(() => import('./CategoryPage'));
const StoresPage = lazy(() => import('./StoresPage'));
const Recommendations = lazy(() => import('./Recommendations'));
const StorePicker = lazy(() => import('./StorePicker'));
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '2 2rem 2rem 2rem',
        }}
        data-boundary-page="explore">
        <h1>Explore Remote - Tractor Sample 2.0</h1>
        <h2>Exported Pages</h2>
        <Link to="/home">Home Page</Link>
        <Link to="/products/:category?">Category Page</Link>
        <Link to="/stores">Stores Page</Link>
        <h2>Exported Components</h2>
        <Suspense fallback={'Loading...'}>
          <Header />
        </Suspense>
        <div style={{ maxWidth: '64rem' }}>
        <Suspense fallback={'Loading...'}>
          {/* <Recommendations skus={[]} /> */}
        </Suspense>
        </div>
        <Suspense fallback={'Loading...'}>
          {/* <StorePicker /> */}
        </Suspense>
        <Suspense fallback={'Loading...'}>
          {/* <Footer /> */}
        </Suspense>
      </div>
    ),
  },
  {
    path: '/products/:category?',
    element: (
      <Suspense fallback={'Loading...'}>
        <CategoryPage />
      </Suspense>
    ),
  },
  {
    path: '/home',
    element: (
      <Suspense fallback={'Loading...'}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/stores',
    element: (
      <Suspense fallback={'Loading...'}>
        <StoresPage />
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
        data-boundary-page="explore">
        <h1>Explore Remote - Tractor Sample 2.0</h1>
        <h2>404 - Page not found</h2>
        <h3>The page you are looking for might be on other remote.</h3>
        <Link to="/">Back to Home</Link>
      </div>
    ),
  },
]);
