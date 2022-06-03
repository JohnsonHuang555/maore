// FIXME: 從 DB 來 => 遊戲列表
export enum GameList {
  ChineseChess = 'chinese-chess',
  MathFormulaCard = 'math-formula-card',
  FindPlaneHead = 'find-plane-head',
}

export type Game = {
  id: number;
  name: string;
  min_players?: number; // 該遊戲沒有模式時有值
  max_players?: number; // 該遊戲沒有模式時有值
  brief: string;
  description: string;
  image_url: string;
  estimate_time: number;
  modes?: GameMode[];
  create_at: string;
  game_pack: GameList;
};

export type GameMode = {
  name: string;
  image_url: string;
  min_players: number;
  max_players: number;
};

export interface IGameRepository {
  FindAll: () => Game[];
  FindByGamePack: (gamePack: GameList) => Game;
}

export interface IGameUseCase {
  GetGames: () => Game[];
  GetGameInfo: (gamePack: GameList) => Game;
}
