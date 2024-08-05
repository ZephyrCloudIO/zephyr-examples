import getCurrentUser from './getCurrentUser';
import saveUser from './saveUser';

export default function deleteFavorite(listingId: string) {
  const currentUser = getCurrentUser();

  if (!currentUser) return false;

  currentUser.favoriteIds = currentUser.favoriteIds.filter((id) => id !== listingId);

  saveUser(currentUser);

  return true;
}
