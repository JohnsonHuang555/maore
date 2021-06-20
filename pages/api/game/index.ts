import type { NextApiRequest, NextApiResponse } from 'next';
import { games } from '../../../server/data/Game';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(games);
}
