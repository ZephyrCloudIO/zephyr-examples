import { listingsMock, reservationsMock } from '../mocks';

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    let reservations = reservationsMock.map((reservation) => ({
      ...reservation,
      listing: listingsMock.find(
        (listing) => listing.id === reservation.listingId
      ),
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

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing?.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
