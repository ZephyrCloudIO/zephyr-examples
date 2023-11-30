import ClientOnly from '@/components/ClientOnly';
import EmptyState from '@/components/EmptyState';

import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';
import FavoritesClient from '../../templates/FavoritesClient';

const ListingPage = () => {
  const { favorites } = useFavorites();
  const { currentUser } = useCurrentUser();

  if (favorites?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite listings."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient listings={favorites} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ListingPage;
