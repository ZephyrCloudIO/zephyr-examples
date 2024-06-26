import getCurrentUser from './getCurrentUser';
import saveUser from './saveUser';

export default function saveFavorite(listingId?: string) {
  const currentUser = getCurrentUser();

  if (!currentUser || !listingId) return false;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  currentUser.favoriteIds.push(listingId);
  saveUser(currentUser);

  return true;
}
