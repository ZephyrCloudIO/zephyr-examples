import EmptyState from '../../components/EmptyState';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import useFavorites from '../../common/hooks/useFavorites';
import { Suspense, lazy } from 'react';

const FavoritesClient = lazy(() => import('favorites/Favorites'));

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { currentUser } = useCurrentUser();

  if (favorites?.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings."
      />
    );
  }

  return (
    <Suspense>
      <FavoritesClient listings={favorites} currentUser={currentUser} />
    </Suspense>
  );
};

export default FavoritesPage;
