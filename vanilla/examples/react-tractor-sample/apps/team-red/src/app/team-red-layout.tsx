import { useEffect, useState, lazy, Suspense } from 'react';

const GreenRecos = lazy(() => import('team_green/GreenRecos'));
const BlueBasket = lazy(() => import('team_blue/BlueBasket'));
const BlueBuy = lazy(() => import('team_blue/BlueBuy'));

interface VariantOption {
  sku: string;
  color: string;
  name: string;
  image: string;
  thumb: string;
  price: string;
}

const product: { name: string; variants: VariantOption[] } = {
  name: 'Tractor',
  variants: [
    {
      sku: 't_porsche',
      color: 'red',
      name: 'Porsche-Diesel Master 419',
      image: './team-red/images/tractor-red.jpg',
      thumb: './team-red/images/tractor-red-thumb.jpg',
      price: '66,00 €',
    },
    {
      sku: 't_fendt',
      color: 'green',
      name: 'Fendt F20 Dieselroß',
      image: './team-red/images/tractor-green.jpg',
      thumb: './team-red/images/tractor-green-thumb.jpg',
      price: '54,00 €',
    },
    {
      sku: 't_eicher',
      color: 'blue',
      name: 'Eicher Diesel 215/16',
      image: './team-red/images/tractor-blue.jpg',
      thumb: './team-red/images/tractor-blue-thumb.jpg',
      price: '58,00 €',
    },
  ],
};

const state: { variant: string } = {
  variant: 't_porsche',
};

function RenderVariantOption(variant: VariantOption) {
  const active = state.variant === variant.sku ? 'active' : '';
  const handleVariantClick = () => {
    state.variant = variant.sku;
    console.log('Red variant changed to', variant.sku);
    window.dispatchEvent(
      new CustomEvent('red:variant:changed', {
        bubbles: true,
      })
    );
  };
  return (
    <button
      className={active}
      type="button"
      key={variant.sku}
      onClick={handleVariantClick}
    >
      <img src={variant.thumb} alt={variant.name} />
    </button>
  );
}

export function TeamRedLayout({ id }: { id: string }) {
  const [variant, setVariant] = useState(
    product.variants.find((v) => state.variant === v.sku)
  );
  useEffect(() => {
    const refresh = () => {
      setVariant(product.variants.find((v) => state.variant === v.sku));
    };
    window.addEventListener('red:variant:changed', refresh);

    return () => {
      window.removeEventListener('red:variant:changed', refresh);
    };
  }, []);

  return (
    <div id={id}>
      <h1 id="store">The Model Store</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BlueBasket id="basket"></BlueBasket>
      </Suspense>
      {variant ? (
        <>
          <div id="image">
            <div>
              <img src={variant.image} alt={variant.name} />
            </div>
          </div>
          <h2 id="name">
            {product.name} <small>{variant.name}</small>
          </h2>
          <div id="options">{product.variants.map(RenderVariantOption)}</div>
          <Suspense fallback={<div>Loading...</div>}>
            <BlueBuy id="buy" sku={variant.sku}></BlueBuy>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <GreenRecos id="reco" sku={variant.sku}></GreenRecos>
          </Suspense>
        </>
      ) : null}
    </div>
  );
}

export default TeamRedLayout;
