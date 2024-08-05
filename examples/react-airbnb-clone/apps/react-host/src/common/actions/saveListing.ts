import { v4 } from 'uuid';
import { listingsMock } from './mocks';
import { Listing } from '../common/types';
import getCurrentUser from './getCurrentUser';
import getListings, { LISTINGS_KEY } from './getListings';

type NewListing = Listing & {
  location: { value: string };
  price: string;
};

export default function saveListing(body: NewListing) {
  const listings = getListings();
  const user = getCurrentUser();

  if (!user) return false;

  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  listings.push({
    id: v4(),
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    locationValue: location.value,
    price: parseInt(price, 10),
    userId: user.id,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));

  return true;
}
