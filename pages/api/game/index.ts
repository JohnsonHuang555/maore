import type { NextApiRequest, NextApiResponse } from 'next';
import { games } from '../data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(games);
}
