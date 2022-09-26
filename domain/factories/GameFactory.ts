import { Game } from '@domain/models/Game';
import { Game as NetGame } from 'server/domain/Game';
import { toJsCaseObject } from 'utils/AjaxDataCase';

export default class GameFactory {
  static createFromNet(netGame: NetGame): Game {
    const game: Game = toJsCaseObject(netGame);
    return game;
  }

  static createArrayFromNet(netGames: NetGame[]): Game[] {
    return netGames.map((netGame) => this.createFromNet(netGame));
  }
}
