export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const products: Product[] = [
  {
    id: 'edge-hoodie',
    name: 'Edge Hoodie',
    price: 59,
    description: 'Deployed to every region before you finish putting it on.',
  },
  {
    id: 'remote-mug',
    name: 'Remote Mug',
    price: 18,
    description: 'Loaded at runtime, refilled without a redeploy.',
  },
  {
    id: 'singleton-socks',
    name: 'Singleton Socks',
    price: 12,
    description: 'Exactly one pair is ever shared across the whole app.',
  },
];

export function findProduct(id: string) {
  return products.find((product) => product.id === id);
}
