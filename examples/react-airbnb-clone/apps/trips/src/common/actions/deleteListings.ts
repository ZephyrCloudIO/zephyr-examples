import getCurrentUser from './getCurrentUser';
import getListings, { LISTINGS_KEY } from './getListings';

export default function deleteListing(listingId: string) {
  const currentUser = getCurrentUser();

  if (!currentUser) return false;

  const listings = getListings();

  const listingIndex = listings.findIndex(
    ({ id, userId }) => id === listingId && userId === currentUser.id
  );

  if (listingIndex === undefined) return false;

  listings.splice(listingIndex, 1);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));

  return true;
}
