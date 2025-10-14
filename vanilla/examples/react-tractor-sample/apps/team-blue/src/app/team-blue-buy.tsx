import { useEffect, useState } from 'react';

const prices: Record<string, string> = {
  t_porsche: '66,00 €',
  t_fendt: '54,00 €',
  t_eicher: '58,00 €',
};
export default function BlueBuy({ id, sku }: { id: string; sku: string }) {
  const [price, setPrice] = useState(prices[sku]);

  const log = (...args: string[]) => {
    console.log('🔘 blue-buy', ...args);
  };

  const addToCart = () => {
    log('event sent "blue:basket:changed"');
    window.dispatchEvent(
      new CustomEvent('blue:basket:changed', {
        bubbles: true,
        detail: { price },
      })
    );
  };

  log('connected', sku);

  useEffect(() => {
    setPrice(prices[sku]);
    log('event sent "blue:basket:changed"');

    return () => {
      log('disconnected', sku);
    };
  }, [sku]);

  return (
    <div id={id}>
      <button type="button" onClick={addToCart}>
        buy for ${price}
      </button>
    </div>
  );
}
