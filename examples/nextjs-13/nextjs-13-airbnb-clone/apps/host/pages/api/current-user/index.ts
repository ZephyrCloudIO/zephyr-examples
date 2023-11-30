import getCurrentUser from '@/actions/getCurrentUser';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      return res.status(405);
  }
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = getCurrentUser();

  return res.json(user);
};
