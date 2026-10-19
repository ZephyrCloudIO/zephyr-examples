import { createRoot } from 'react-dom/client';
import ProductCard from './ProductCard';

// Standalone page for working on the remote without a host.
createRoot(document.getElementById('root')!).render(
  <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
    <h1>Product card remote</h1>
    <ProductCard name="Trail running shoe" price="$129" />
  </main>
);
