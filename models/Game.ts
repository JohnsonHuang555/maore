// 遊戲列表
export enum GameList {
  TicTacToe = 'tic-tac-toe', // deprecated
  ChineseChess = 'chinese-chess',
  MathFormulaCard = 'math-formula-card',
}

export type Game = {
  id: number;
  name: string;
  maxPlayers?: number; // 該遊戲沒有模式時有值
  minPlayers?: number; // 該遊戲沒有模式時有值
  brief: string;
  description: string;
  imgPath: string;
  estimateTime: number;
  gamePack: GameList;
  modes?: GameMode[];
  createAt: string;
};

export type GameMode = {
  label: string;
  value: string;
  image: string;
  maxPlayers: number;
  minPlayers: number;
};
