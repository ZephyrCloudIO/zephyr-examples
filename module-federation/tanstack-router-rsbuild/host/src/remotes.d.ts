// Contracts for the modules exposed by the catalog remote
declare module 'catalog/ProductList' {
  export default function ProductList(): React.JSX.Element;
}

declare module 'catalog/ProductDetail' {
  export default function ProductDetail(props: { productId: string }): React.JSX.Element;
}
