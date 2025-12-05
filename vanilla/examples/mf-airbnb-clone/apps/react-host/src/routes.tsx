import type { RouteObject } from 'react-router-dom';
import Home from './pages/home';
import RootLayout from './layout';
import TripsPage from './pages/trips';
import FavoritesPage from './pages/favorites';
import ReservationsPage from './pages/reservations';
import PropertiesPage from './pages/properties';
import ListingPage from './pages/listings';
import EmptyState from './components/EmptyState';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <EmptyState title="An unexpected error occurred." subtitle="" />,
    children: [
      { index: true, element: <Home /> },
      { path: 'trips', element: <TripsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'reservations', element: <ReservationsPage /> },
      { path: 'properties', element: <PropertiesPage /> },
      { path: 'listings/:listingId', element: <ListingPage /> },
    ],
  },
];
