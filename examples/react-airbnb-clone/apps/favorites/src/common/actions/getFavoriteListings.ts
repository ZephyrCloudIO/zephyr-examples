import getCurrentUser from './getCurrentUser';
import getListings from './getListings';

export default function getFavoriteListings() {
  try {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const listings = getListings();

    const favorites = listings.filter(({ id }) =>
      currentUser.favoriteIds.includes(id),
    );

    return favorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
