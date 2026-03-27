import {useQuery} from '@tanstack/react-query';

import {Product} from '../types';

const PRODUCTS: Array<Product> = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Classic T-Shirt',
    description:
      'A timeless wardrobe essential made from 100% soft and breathable cotton. This t-shirt is lightweight, durable, and perfect for casual outings or layering under jackets. Features a relaxed fit with double-stitched hems for extra durability.',
    price: 19.99,
    rating: 4.5,
    colorsAvailable: [
      {name: 'White', hex: '#FFFFFF'},
      {name: 'Black', hex: '#000000'},
      {name: 'Gray', hex: '#808080'},
      {name: 'Navy', hex: '#000080'},
    ],
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
    pictureUrl:
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    name: 'Denim Jacket',
    description:
      'A trendy yet durable denim jacket crafted from high-quality cotton denim. Designed with a slim-fit silhouette, button-up front, and adjustable waist tabs for a modern and comfortable fit. Features classic chest pockets and side pockets for practicality.',
    price: 69.99,
    rating: 3,
    colorsAvailable: [
      {name: 'Classic Blue', hex: '#3C6478'},
      {name: 'Black', hex: '#000000'},
      {name: 'Light Wash', hex: '#A3C1DA'},
    ],
    sizesAvailable: ['XS', 'S', 'M', 'L', 'XL'],
    pictureUrl:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Skinny Jeans',
    description:
      'Sleek and modern skinny jeans designed for versatility and comfort. Made from a stretchable cotton blend for all-day wear and a tailored fit. Perfect for casual outings or pairing with formal tops for a smart-casual look.',
    price: 49.99,
    rating: 2.5,
    colorsAvailable: [
      {name: 'Black', hex: '#000000'},
      {name: 'Dark Gray', hex: '#333333'},
      {name: 'Charcoal', hex: '#4A4A4A'},
    ],
    sizesAvailable: ['26', '28', '30', '32', '34', '36', '38'],
    pictureUrl:
      'https://images.unsplash.com/photo-1516271099866-de31ba93ee4b?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '6b23c1a2-0876-4b6c-bf9d-5391b6cb88a3',
    name: 'Hooded Sweatshirt',
    description:
      'Stay cozy in this ultra-soft hooded sweatshirt made from a premium cotton-polyester blend. Designed with a spacious front pocket, adjustable drawstring hood, and ribbed cuffs for a snug fit. Available in a variety of colors to suit your style.',
    price: 39.99,
    rating: 5,
    colorsAvailable: [
      {name: 'Black', hex: '#000000'},
      {name: 'Gray', hex: '#808080'},
      {name: 'Navy', hex: '#000080'},
      {name: 'Burgundy', hex: '#800020'},
      {name: 'Olive', hex: '#808000'},
    ],
    sizesAvailable: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    pictureUrl:
      'https://images.unsplash.com/photo-1678354885631-2c3433f3aab4?q=80&w=3385&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'dbb5b3c4-cc48-42d1-9d9c-e00765d2d3c1',
    name: 'Leather Boots',
    description:
      'Step out in style with these premium leather boots, crafted for durability and timeless appeal. Featuring a rugged yet refined design with sturdy soles and reinforced stitching. Perfect for outdoor adventures or adding a touch of sophistication to your look.',
    price: 129.99,
    rating: 4.7,
    colorsAvailable: [
      {name: 'Brown', hex: '#8B4513'},
      {name: 'Black', hex: '#000000'},
      {name: 'Tan', hex: '#D2B48C'},
    ],
    sizesAvailable: ['7', '8', '9', '10', '11', '12', '13'],
    pictureUrl:
      'https://images.unsplash.com/photo-1599012307605-23a0ebe4d321?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '1c7e3e2e-7f6b-4d17-babc-7e22171b9c4c',
    name: 'Wool Scarf',
    description:
      'Add a touch of elegance to your winter wardrobe with this cozy wool scarf. Made from 100% natural wool, it provides superior warmth and comfort. Available in a range of classic patterns, including plaid and solid colors.',
    price: 24.99,
    rating: 4.2,
    colorsAvailable: [
      {name: 'Red Plaid', hex: '#B22222'},
      {name: 'Gray', hex: '#808080'},
      {name: 'Navy', hex: '#000080'},
      {name: 'Beige', hex: '#F5F5DC'},
    ],
    sizesAvailable: ['One Size Fits All'],
    pictureUrl:
      'https://images.unsplash.com/photo-1711097258176-c1a4bb511aa7?q=80&w=3424&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

function getProducts(): Promise<Array<Product>> {
  return new Promise(resolve => {
    setTimeout(() => resolve(PRODUCTS), 1000);
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
}

export function useProduct(productId: string) {
  const {data: products} = useProducts();

  return products ? products.find(p => p.id === productId) : null;
}
