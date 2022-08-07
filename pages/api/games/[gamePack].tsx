import { NextApiResponse, NextApiRequest } from 'next';
import GameFactory from '@domain/factories/GameFactory';
import { Game } from '@domain/models/Game';
import { Games } from 'server/data/Game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  const { query } = req;
  const { gamePack } = query;
  const filterGame = Games.filter((g) => g.game_pack === gamePack);
  const game = GameFactory.createFromNet(filterGame[0]);
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(game);
}
