import { Link } from '@tanstack/react-router';
import { findProduct } from './products';
import './catalog.css';

export interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const product = findProduct(productId);

  return (
    <section className="catalog">
      <span className="catalog-badge">Served by the catalog remote</span>
      {product ? (
        <>
          <h2>{product.name}</h2>
          <p className="catalog-price">${product.price}</p>
          <p>{product.description}</p>
        </>
      ) : (
        <h2>No product called "{productId}"</h2>
      )}
      <Link to="/products">Back to products</Link>
    </section>
  );
}
