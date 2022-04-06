import { Game, GameMode } from "@models/Game";
import { enhanceGameModes } from "features/chinese_chess/models/ChinesChessMode";
import { Game as NetGame } from "server/domain/Game";
import { toJsCaseObject } from 'utils/AjaxDataCase';

const combinedEnhanceGameModes = {
  ...enhanceGameModes,
}

export default class GameFactory {
  static createFromNet(netGame: NetGame): Game {
    const game: Game = toJsCaseObject(netGame);
    const modes = netGame.modes?.map(m => {
      const mode: GameMode = toJsCaseObject(m);
      return {
        ...mode,
        label: combinedEnhanceGameModes[m.name],
        value: m.name,
      };
    });
    return {
      ...game,
      modes,
    }
  }

  static createArrayFromNet(netGames: NetGame[]): Game[] {
    return netGames.map(netGame => this.createFromNet(netGame));
  }
}