declare module 'airbnb_categories/Categories' {
  export * from '@categories/src/components/Categories';
  import Categories from '@categories/src/components/Categories';
  export default Categories;
}

declare module 'airbnb_home/Home' {
  export * from '@home/src/home';
  import Home from '@home/src/home';
  export default Home;
}

declare module 'airbnb_favorites/Favorites' {
  export * from '@favorites/src/favorites';
  import Home from '@favorites/src/favorites';
  export default Home;
}

declare module 'airbnb_trips/Trips' {
  export * from '@trips/src/trips';
  import Home from '@trips/src/trips';
  export default Home;
}

declare module 'airbnb_reservations/Reservations' {
  export * from '@reservations/src/reservations';
  import Home from '@reservations/src/reservations';
  export default Home;
}

declare module 'airbnb_properties/Properties' {
  export * from '@properties/src/properties';
  import Home from '@properties/src/properties';
  export default Home;
}
