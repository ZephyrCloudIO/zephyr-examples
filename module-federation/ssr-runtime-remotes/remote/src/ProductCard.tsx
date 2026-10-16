import { useState } from 'react';

declare const __PRODUCT_CARD_VERSION__: string;

export interface ProductCardProps {
  name: string;
  price: string;
}

/**
 * Rendered by the host on its server and hydrated in the browser. Styles are
 * inline so the server-rendered HTML is styled before any remote code loads.
 */
export default function ProductCard({ name, price }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  return (
    <article style={{ border: '1px solid #d4d4d8', borderRadius: 12, padding: 20, maxWidth: 320 }}>
      <h2 style={{ margin: '0 0 4px' }}>{name}</h2>
      <p style={{ margin: '0 0 16px', fontSize: 20 }}>{price}</p>
      <button type="button" onClick={() => setQuantity((count) => count + 1)}>
        Add to cart ({quantity})
      </button>
      <p style={{ margin: '16px 0 0', color: '#71717a', fontSize: 13 }}>
        Product card {__PRODUCT_CARD_VERSION__}
      </p>
    </article>
  );
}
