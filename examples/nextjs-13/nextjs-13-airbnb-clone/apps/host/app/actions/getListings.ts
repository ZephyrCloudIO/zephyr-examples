import { listingsMock } from '../mocks';
import { Listing } from '../types';

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let listings: Listing[] = listingsMock;

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

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
