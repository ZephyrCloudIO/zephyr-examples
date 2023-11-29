import getCurrentUser from './getCurrentUser';
import { listingsMock } from '../mocks';

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = listingsMock.filter(({ id }) =>
      currentUser.favoriteIds.includes(id)
    );

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}