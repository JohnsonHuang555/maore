// FIXME: 從 DB 來 => 遊戲列表
// export enum GameList {
//   TicTacToe = 'tic-tac-toe', // deprecated
//   ChineseChess = 'chinese-chess',
//   MathFormulaCard = 'math-formula-card',
// }

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
};

export type GameMode = {
  name: string;
  image_url: string;
  min_players: number;
  max_players: number;
};

export interface IGameRepository {
  FindAll: () => Game[];
  FindById: (id: number) => Game;
}

export interface IGameUseCase {
  GetGames: () => Game[];
  GetGameInfo: (id: number) => Game;
}
