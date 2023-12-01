import getCurrentUser from '../../../actions/getCurrentUser';
import { listingsMock, reservationsMock } from '../../../mocks';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      return DELETE(req, res);
    default:
      return res.status(405);
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return res.status(400).send('Unauthorized');
  }

  const { reservationId } = req.query;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  const reservationIndex = reservationsMock.findIndex((reservation) => {
    if (reservation.id !== reservationId) return false;
    if (reservation.userId === currentUser.id) return true;

    const listing = listingsMock.find(
      ({ id }) => id === reservation.listingId,
    )!;
    if (listing.userId === currentUser.id) return true;

    return false;
  });
  const reservation = { ...reservationsMock[reservationIndex] };
  reservationsMock.splice(reservationIndex, 1);

  return res.json(reservation);
}
