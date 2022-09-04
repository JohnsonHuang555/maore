import { Game } from '@domain/models/Game';
import { EnhanceGameModes as ChinesChessMode } from 'features/chinese_chess/models/ChinesChessMode';
import { Game as NetGame } from 'server/domain/Game';
import { toJsCaseObject } from 'utils/AjaxDataCase';

const combinedEnhanceGameModes = {
  ...ChinesChessMode,
};

export default class GameFactory {
  static createFromNet(netGame: NetGame): Game {
    const game: Game = toJsCaseObject(netGame);
    return game;
  }

  static createArrayFromNet(netGames: NetGame[]): Game[] {
    return netGames.map((netGame) => this.createFromNet(netGame));
  }
}
