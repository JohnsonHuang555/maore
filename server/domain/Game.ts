// FIXME: 從 DB 來 => 遊戲列表
export enum GamePack {
  ChineseChessHidden = 'chinese-chess-hidden',
  MathFormulaCard = 'math-formula-card',
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
  create_at: string;
  game_pack: GamePack;
};

export type GameMode = {
  name: string;
  image_url: string;
  min_players: number;
  max_players: number;
};

export interface IGameRepository {
  FindAll: () => Game[];
  FindByGamePack: (gamePack: GamePack) => Game;
}

export interface IGameUseCase {
  GetGames: () => Game[];
  GetGameInfo: (gamePack: GamePack) => Game;
}
