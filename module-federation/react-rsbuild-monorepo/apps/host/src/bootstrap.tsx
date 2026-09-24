import Header from 'header/Header';
import Hero from 'hero/Hero';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Expected Rsbuild to provide #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <Header />
    <Hero />
  </StrictMode>,
);
