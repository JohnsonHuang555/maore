import { Game } from 'domain/models/Game';
import { Game as NetGame } from 'server/domain/Game';
import axios from 'axios';
import GameFactory from 'domain/factories/GameFactory';

export const fetchGames = async (url: string): Promise<Game[]> => {
  const res = await axios.get<NetGame[]>(url);
  const games = GameFactory.createArrayFromNet(res.data);

  if (res.status !== 200) {
    throw new Error('Get games failed');
  }

  return games;
};

export const fetchGame = async (url: string): Promise<Game> => {
  const res = await axios.get<NetGame>(url);
  const game = GameFactory.createFromNet(res.data);

  if (res.status !== 200) {
    throw new Error('Get game failed');
  }

  return game;
}
