import type { NextApiRequest, NextApiResponse } from 'next';
import { games } from '../../../server/data/Game';

export default function gameHandler(
  { query: { gamePack } }: NextApiRequest,
  res: NextApiResponse
) {
  const filterGames = games.filter((game) => game.gamePack === gamePack);
  if (filterGames.length) {
    res.status(200).json(filterGames[0]);
  } else {
    res.status(404).json({ message: 'Game not found' });
  }
}
