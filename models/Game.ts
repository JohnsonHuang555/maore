export type Game = {
  id: number;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  brief: string;
  description: string;
  homeImg: string;
  estimateTime: number;
  gamePack: GameList;
};

// 遊戲列表
export enum GameList {
  TicTacToe = 'tic-tac-toe',
  Chess = 'chess',
}
