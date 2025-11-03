export type SafeReservation = Reservation & {
  listing: Listing;
};

export type User = {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: string;
  image?: string;
  hashedPassword?: string;
  createdAt: string;
  updatedAt: string;
  favoriteIds: string[];
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string;
  price: number;
};

export type Reservation = {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
};
