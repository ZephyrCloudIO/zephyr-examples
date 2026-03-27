import getCurrentUser from './getCurrentUser';
import getListings from './getListings';
import getReservations, { RESERVATIONS_KEY } from './getReservations';

export default function deleteReservation(reservationId: string) {
  const currentUser = getCurrentUser();

  if (!currentUser) return false;

  const reservations = getReservations();
  const listings = getListings();

  const reservationIndex = reservations.findIndex((reservation) => {
    if (reservation.id !== reservationId) return false;
    if (reservation.userId === currentUser.id) return true;

    const listing = listings.find(({ id }) => id === reservation.listingId)!;
    if (listing.userId === currentUser.id) return true;

    return false;
  });

  reservations.splice(reservationIndex, 1);
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));

  return true;
}
