import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { listingsMock, reservationsMock } from '@/app/mocks';

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  const reservationIndex = reservationsMock.findIndex((reservation) => {
    if (reservation.id !== reservationId) return false;
    if (reservation.userId === currentUser.id) return true;

    const listing = listingsMock.find(
      ({ id }) => id === reservation.listingId
    )!;
    if (listing.userId === currentUser.id) return true;

    return false;
  });
  const reservation = { ...reservationsMock[reservationIndex] };
  reservationsMock.splice(reservationIndex, 1);

  return NextResponse.json(reservation);
}
