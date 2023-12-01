import { usersMock } from '@/mocks';
import { randomUUID,  } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    default:
      return res.status(405);
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const { email, name } = body;

  const user = usersMock.push({
    id: randomUUID(),
    email,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteIds: [],
  });

  return res.json(user);
}
