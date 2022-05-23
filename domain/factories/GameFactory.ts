import { Game, GameMode } from '@domain/models/Game';
import { EnhanceGameModes as ChinesChessMode } from 'features/chinese_chess/models/ChinesChessMode';
import { Game as NetGame } from 'server/domain/Game';
import { toJsCaseObject } from 'utils/AjaxDataCase';

const combinedEnhanceGameModes = {
  ...ChinesChessMode,
};

export default class GameFactory {
  static createFromNet(netGame: NetGame): Game {
    const game: Game = toJsCaseObject(netGame);
    const modes: GameMode[] | undefined = netGame.modes?.map((m) => {
      return {
        label: combinedEnhanceGameModes[m.name],
        value: m.name,
        maxPlayers: m.max_players,
        minPlayers: m.min_players,
        imageUrl: m.image_url,
      } as GameMode;
    });
    return {
      ...game,
      modes,
    };
  }

  static createArrayFromNet(netGames: NetGame[]): Game[] {
    return netGames.map((netGame) => this.createFromNet(netGame));
  }
}
