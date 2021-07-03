import {
  ChessNameRed,
  ChessNameBlack,
  ChessSide,
} from '../../../../features/chinese_chess/models/ChineseChess';

type ChessHiddenMap = {
  id: number;
  side: ChessSide;
  name: ChessNameBlack | ChessNameRed;
  rank: number;
};

export const ChessHiddenMap: { [key: number]: ChessHiddenMap } = {
  0: {
    id: 1,
    side: ChessSide.Black,
    name: ChessNameBlack.King,
    rank: 6,
  },
  1: {
    id: 2,
    side: ChessSide.Black,
    name: ChessNameBlack.Guard,
    rank: 5,
  },
  2: {
    id: 3,
    side: ChessSide.Black,
    name: ChessNameBlack.Guard,
    rank: 5,
  },
  3: {
    id: 4,
    side: ChessSide.Black,
    name: ChessNameBlack.Minister,
    rank: 4,
  },
  4: {
    id: 5,
    side: ChessSide.Black,
    name: ChessNameBlack.Minister,
    rank: 4,
  },
  5: {
    id: 6,
    side: ChessSide.Black,
    name: ChessNameBlack.Chariot,
    rank: 3,
  },
  6: {
    id: 7,
    side: ChessSide.Black,
    name: ChessNameBlack.Chariot,
    rank: 3,
  },
  7: {
    id: 8,
    side: ChessSide.Black,
    name: ChessNameBlack.Horse,
    rank: 2,
  },
  8: {
    id: 9,
    side: ChessSide.Black,
    name: ChessNameBlack.Horse,
    rank: 2,
  },
  9: {
    id: 10,
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  10: {
    id: 11,
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  11: {
    id: 12,
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  12: {
    id: 13,
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  13: {
    id: 14,
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  14: {
    id: 15,
    side: ChessSide.Black,
    name: ChessNameBlack.Cannon,
    rank: 0,
  },
  15: {
    id: 16,
    side: ChessSide.Black,
    name: ChessNameBlack.Cannon,
    rank: 0,
  },
  16: {
    id: 17,
    side: ChessSide.Red,
    name: ChessNameRed.King,
    rank: 6,
  },
  17: {
    id: 18,
    side: ChessSide.Red,
    name: ChessNameRed.Guard,
    rank: 5,
  },
  18: {
    id: 19,
    side: ChessSide.Red,
    name: ChessNameRed.Guard,
    rank: 5,
  },
  19: {
    id: 20,
    side: ChessSide.Red,
    name: ChessNameRed.Minister,
    rank: 4,
  },
  20: {
    id: 21,
    side: ChessSide.Red,
    name: ChessNameRed.Minister,
    rank: 4,
  },
  21: {
    id: 22,
    side: ChessSide.Red,
    name: ChessNameRed.Chariot,
    rank: 3,
  },
  22: {
    id: 23,
    side: ChessSide.Red,
    name: ChessNameRed.Chariot,
    rank: 3,
  },
  23: {
    id: 24,
    side: ChessSide.Red,
    name: ChessNameRed.Horse,
    rank: 2,
  },
  24: {
    id: 25,
    side: ChessSide.Red,
    name: ChessNameRed.Horse,
    rank: 2,
  },
  25: {
    id: 26,
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  26: {
    id: 27,
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  27: {
    id: 28,
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  28: {
    id: 29,
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  29: {
    id: 30,
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  30: {
    id: 31,
    side: ChessSide.Red,
    name: ChessNameRed.Cannon,
    rank: 0,
  },
  31: {
    id: 32,
    side: ChessSide.Red,
    name: ChessNameRed.Cannon,
    rank: 0,
  },
};
