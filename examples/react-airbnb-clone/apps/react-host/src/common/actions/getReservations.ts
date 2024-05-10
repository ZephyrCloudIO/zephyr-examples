import { reservationsMock } from './mocks';
import { Reservation } from '../common/types';
import getListings from './getListings';

export const RESERVATIONS_KEY = 'airbnb-reservations';

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default function getReservations(params: IParams = {}): Reservation[] {
  const { listingId, userId, authorId } = params;
  let allReservations = reservationsMock;
  const storageRes = localStorage.getItem(RESERVATIONS_KEY);

  if (storageRes) {
    allReservations = JSON.parse(storageRes);
  } else {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(allReservations));
  }

  const listings = getListings();

  let reservations = allReservations.map((reservation) => ({
    ...reservation,
    listing: listings.find((listing) => listing.id === reservation.listingId)!,
  }));

  if (listingId) {
    reservations = reservations.filter(
      (reservation) => reservation.listingId === listingId
    );
  }

  if (userId) {
    reservations = reservations.filter(
      (reservation) => reservation.userId === userId
    );
  }

  if (authorId) {
    reservations = reservations.filter(
      (reservation) => reservation.listing?.userId === authorId
    );
  }

  return reservations;
}
