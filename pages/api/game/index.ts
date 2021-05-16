import { Game } from 'domain/models/Game';
import type { NextApiRequest, NextApiResponse } from 'next';

// TODO: 假資料之後寫入資料庫
const games: Game[] = [
  {
    id: 1,
    name: '圈圈叉叉',
    minPlayers: 2,
    maxPlayers: 2,
    breif: '我的第一個遊戲',
    description: '有個必勝的公式',
    homeImg: '/tictactoe/home.png',
    estimateTime: 5,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(games);
}
