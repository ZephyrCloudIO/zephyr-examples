import getCurrentUser from '@/actions/getCurrentUser';
import { listingsMock, reservationsMock } from '@/mocks';
import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import getReservations from '@/actions/getReservations';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    case 'GET':
      return GET(req, res);
    default:
      return res.status(405);
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const reservations = getReservations(req.query);

  return res.json(reservations);
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return res.status(400).send('Unauthorized');
  }

  const body = req.body;
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return res.status(404);
  }

  const reservation = reservationsMock.push({
    id: randomUUID(),
    listingId,
    createdAt: new Date(),
    userId: currentUser.id,
    startDate,
    endDate,
    totalPrice,
  });

  const listingAndReservation = {
    ...listingsMock.find(({ id }) => id === listingId)!,
    reservations: [reservation],
  };

  return res.json(listingAndReservation);
}
