import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import './globals.css';

const router = createBrowserRouter(routes);

const container = document.getElementById('root');

createRoot(container!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
