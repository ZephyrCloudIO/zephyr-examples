import EmptyState from '../../components/EmptyState';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import useFavorites from '../../common/hooks/useFavorites';
import { lazy } from 'react';
import RemoteWrap from '../../components/RemoteWrap';

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
    <RemoteWrap remoteName='favorites' >
      <FavoritesClient listings={favorites} currentUser={currentUser} />
    </RemoteWrap>
  );
};

export default FavoritesPage;
