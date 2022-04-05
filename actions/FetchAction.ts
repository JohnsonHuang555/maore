import { Game } from 'domain/models/Game';
import { Game as NetGame } from 'server/domain/Game';
import axios from 'axios';
import GameFactory from 'domain/factories/GameFactory';

export const fetchGames = async (url: string): Promise<Game[]> => {
  const res = await axios.get<NetGame[]>(url);
  const data = await res.data;

  const games = GameFactory.createArrayFromNet(data);

  if (res.status !== 200) {
    throw new Error('Get games failed');
  }

  return games;
};
