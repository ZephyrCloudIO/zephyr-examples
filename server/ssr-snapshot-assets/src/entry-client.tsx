import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { RENDER_INFO_ID, type RenderInfo } from './render-info';
// Styles are imported here, not in App.tsx, so server code never imports CSS.
import './index.css';

const root = document.getElementById('root')!;
const serialized = document.getElementById(RENDER_INFO_ID)?.textContent;

if (serialized) {
  // Served by our SSR server: adopt the existing markup.
  const info = JSON.parse(serialized) as RenderInfo;
  hydrateRoot(
    root,
    <StrictMode>
      <App info={info} />
    </StrictMode>
  );
} else {
  // Opened straight from the Zephyr URL: plain client-side rendering.
  createRoot(root).render(
    <StrictMode>
      <App info={null} />
    </StrictMode>
  );
}
