import { usersMock } from './mocks';
import getListings from './getListings';

interface IParams {
  listingId?: string;
}

export default function getListingById({ listingId }: IParams) {
  const listings = getListings();
  const found = listings.find(({ id }) => id === listingId);

  if (!found) return false;

  const listing = {
    ...found,
    user: usersMock.find(({ id }) => id === found.userId),
  };

  return {
    ...listing,
    createdAt: listing.createdAt.toString(),
    user: {
      ...listing.user,
      createdAt: listing.user?.createdAt.toString(),
      updatedAt: listing.user?.updatedAt.toString(),
      emailVerified: listing.user?.emailVerified?.toString() || null,
    },
  };
}
