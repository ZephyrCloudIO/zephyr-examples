import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';

const CartPage = lazy(() => import('./CartPage'));
const Checkout = lazy(() => import('./Checkout'));
const Thanks = lazy(() => import('./Thanks'));
const AddToCart = lazy(() => import('./AddToCart'));
const MiniCart = lazy(() => import('./MiniCart'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', paddingBottom: '2rem' }}
        data-boundary-page="checkout">
        <h1>Checkout Remote - Tractor Sample 2.0</h1>
        <h2>Exported Pages</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }}>
          <Link to="/checkout/cart">Cart Page</Link>
          <Link to="/checkout/checkout">Checkout Page</Link>
          <Link to="/checkout/thanks">Thanks Page</Link>
        </div>
        <h2>Exported Components</h2>
        <AddToCart sku="AU-01-SI" />
        <MiniCart />
      </div>
    ),
  },
  {
    path: '/checkout/cart',
    element: (
      <Suspense fallback={'Loading...'}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: '/checkout/checkout',
    element: (
      <Suspense fallback={'Loading...'}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: '/checkout/thanks',
    element: (
      <Suspense fallback={'Loading...'}>
        <Thanks />
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
        data-boundary-page="checkout">
        <h1>Checkout Remote - Tractor Sample 2.0</h1>
        <h2>404 - Page not found</h2>
        <h3>The page you are looking for might be on other remote.</h3>
        <Link to="/">Back to Home</Link>
      </div>
    ),
  },
]);
