// dsl
declare module 'dsl/Button' {
  import Button from '@dsl/Button';
  export * from '@dsl/components/Button';
  export default Button;
}

declare module 'dsl/Carousel' {
  import Carousel from '@dsl/Carousel';
  export * from '@dsl/components/Carousel';
  export default Carousel;
}

declare module 'dsl/TextField' {
  import TextField from '@dsl/TextField';
  export * from '@dsl/components/TextField';
  export default TextField;
}

// home

declare module 'home/ProductCarousel' {
  import ProductCarousel from '@home/ProductCarousel';
  export * from '@home/ProductCarousel';
  export default ProductCarousel;
}

declare module 'home/HeroImage' {
  import HeroImage from '@home/HeroImage';
  export * from '@home/HeroImage';
  export default HeroImage;
}

// nav

declare module 'nav/Header' {
  import Header from '@nav/Header';
  export * from '@nav/Header';
  export default Header;
}

declare module 'nav/Footer' {
  import Footer from '@nav/Footer';
  export * from '@nav/Footer';
  export default Footer;
}

// search

declare module 'search/SearchList' {
  import SearchList from '@search/SearchList';
  export * from '@search/SearchList';
  export default SearchList;
}

declare module 'search/MiniSearch' {
  import MiniSearch from '@search/MiniSearch';
  export * from '@search/MiniSearch';
  export default MiniSearch;
}

// utils

declare module 'utils/analytics' {
  import analytics from '@utils/analytics';
  export * from '@utils/analytics';
  export default analytics;
}

declare module 'utils/foo' {
  import foo from '@utils/foo';
  export * from '@utils/foo';
  export default foo;
}
