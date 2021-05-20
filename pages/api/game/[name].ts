import type { NextApiRequest, NextApiResponse } from 'next';
import { games } from '../data';

export default function gameHandler(
  { query: { name } }: NextApiRequest,
  res: NextApiResponse
) {
  const filterGames = games.filter((game) => game.name === name);
  if (filterGames.length) {
    res.status(200).json(filterGames[0]);
  } else {
    res.status(404).json({ message: 'Game not found' });
  }
}
