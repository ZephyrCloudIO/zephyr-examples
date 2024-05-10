import { Reservation } from '../common/types';
import getReservations, { RESERVATIONS_KEY } from './getReservations';
import getCurrentUser from './getCurrentUser';
import { v4 } from 'uuid';

type NewReservation = Pick<
  Reservation,
  'listingId' | 'startDate' | 'endDate' | 'totalPrice'
>;

export default function saveReservation(body: NewReservation) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return false;
  }

  const reservations = getReservations();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return false;
  }

  reservations.push({
    id: v4(),
    listingId,
    createdAt: new Date().toISOString(),
    userId: currentUser.id,
    startDate,
    endDate,
    totalPrice,
  });

  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));

  return true;
}
