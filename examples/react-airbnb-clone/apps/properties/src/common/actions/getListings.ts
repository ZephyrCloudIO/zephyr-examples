import { listingsMock } from './mocks';
import { Listing } from '../types';

export const LISTINGS_KEY = 'airbnb-listings';

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  locationValue?: string;
  category?: string;
}

export default function getListings(params: IListingsParams = {}) {
  try {
    const { userId, roomCount, guestCount, bathroomCount, locationValue, category } = params;

    let listings: Listing[] = listingsMock;

    const storageListings = localStorage.getItem(LISTINGS_KEY);
    if (storageListings) {
      listings = JSON.parse(storageListings);
    } else {
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    }

    if (userId) {
      listings = listings.filter((listing) => userId === listing.userId);
    }

    if (category) {
      listings = listings.filter((listing) => category === listing.category);
    }

    if (roomCount) {
      listings = listings.filter((listing) => +roomCount <= listing.roomCount);
    }

    if (guestCount) {
      listings = listings.filter((listing) => +guestCount <= listing.guestCount);
    }

    if (bathroomCount) {
      listings = listings.filter((listing) => +bathroomCount <= listing.bathroomCount);
    }

    if (locationValue) {
      listings = listings.filter((listing) => locationValue === listing.locationValue);
    }

    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
}
