import { GameMode as TicTacToeMode } from '../features/tictactoe/models/Mode';
import { GameMode as ChineseChessMode } from '../features/chinese_chess/models/Mode';

// 遊戲列表
export enum GameList {
  TicTacToe = 'tic-tac-toe',
  ChineseChess = 'chinese-chess',
}

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
  modes?: GameMode[];
};

export type GameMode = {
  label: string;
  value: string;
  image: string;
};

export const EnhanceGame: {
  [key in GameList.TicTacToe | GameList.ChineseChess]: {
    [key: string]: string;
  };
} = {
  [GameList.TicTacToe]: TicTacToeMode,
  [GameList.ChineseChess]: ChineseChessMode,
};
