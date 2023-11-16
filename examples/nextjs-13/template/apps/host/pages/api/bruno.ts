import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  headers: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).json({ message: 'E aí moçada', headers: req.headers });
}
