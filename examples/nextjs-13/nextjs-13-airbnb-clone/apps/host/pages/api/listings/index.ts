import getCurrentUser from '@/actions/getCurrentUser';
import { listingsMock } from '@/mocks';
import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import getListings from '@/actions/getListings';

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

async function GET(request: NextApiRequest, res: NextApiResponse) {
  const listings = getListings(request.query);

  return res.json(listings);
}

async function POST(request: NextApiRequest, res: NextApiResponse) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return res.status(400).send('Unauthorized');
  }
  console.log(0);

  const body = request.body;
  const { title, description, imageSrc, category, roomCount, bathroomCount, guestCount, location, price } = body;

  const listing = listingsMock.push({
    id: randomUUID(),
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    locationValue: location.value,
    price: parseInt(price, 10),
    userId: currentUser.id,
    createdAt: new Date(),
  });

  return res.json(listing);
}
