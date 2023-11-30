import getCurrentUser from '@/actions/getCurrentUser';
import { listingsMock } from '@/mocks';
import { NextApiRequest, NextApiResponse } from 'next';
import getListingById from '@/actions/getListingById';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      return DELETE(req, res);
    case 'GET':
      return GET(req, res);
    default:
      return res.status(405);
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const listing = getListingById(req.query);
  return res.json(listing);
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return res.status(400);
  }

  const { listingId } = req.query;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const listingIndex = listingsMock.findIndex(
    ({ id, userId }) => id === listingId && userId === currentUser.id
  );

  const listing = { ...listingsMock[listingIndex] };
  listingsMock.splice(listingIndex, 1);

  return res.json(listing);
}
