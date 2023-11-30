import getCurrentUser from '@/actions/getCurrentUser';
import { usersMock } from '@/mocks';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    case 'DELETE':
      return DELETE(req, res);
    default:
      return res.status(405);
  }
}

async function POST(request: NextApiRequest, res: NextApiResponse) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return res.status(400);
  }

  const { listingId } = request.query;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = usersMock.find((user) => (user.id = currentUser.id))!;

  user.favoriteIds = favoriteIds;

  return res.json(user);
}

async function DELETE(request: NextApiRequest, res: NextApiResponse) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return res.status(400);
  }

  const { listingId } = request.query;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = usersMock.find((user) => (user.id = currentUser.id))!;

  user.favoriteIds = favoriteIds;

  return res.json(user);
}
