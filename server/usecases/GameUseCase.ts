import { Game, GameList } from '../../models/Game';
import { games } from '../data/Game';

export default class GameUseCase {
  static getAllGames(): Game[] {
    return games;
  }

  static getGameByGamePack(gamePack: GameList): Game {
    const game = games.find((g) => g.gamePack === gamePack);
    if (!game) {
      throw new Error('game not found...');
    }
    return game;
  }
}
