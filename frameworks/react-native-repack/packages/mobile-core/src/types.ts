export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  pictureUrl: string;
  colorsAvailable: Array<ProductColor>;
  sizesAvailable: Array<string>;
};
