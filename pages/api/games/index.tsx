import GameFactory from '@domain/factories/GameFactory';
import { Game } from '@domain/models/Game';
import { NextApiResponse, NextApiRequest } from 'next';
import { Games } from 'server/data/Game';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Game[]>
) {
  const games = GameFactory.createArrayFromNet(Games);
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(games);
}
