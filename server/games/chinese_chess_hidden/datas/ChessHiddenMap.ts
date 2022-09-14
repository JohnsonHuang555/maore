import {
  ChessNameRed,
  ChessNameBlack,
} from '../../../../features/chinese_chess/models/ChineseChessName';

import { ChessSide } from '../../../../features/chinese_chess/models/ChineseChessSide';

type ChessHiddenMap = {
  side: ChessSide;
  name: ChessNameBlack | ChessNameRed;
  rank: number;
};

export const ChessHiddenMap: { [key: number]: ChessHiddenMap } = {
  0: {
    side: ChessSide.Black,
    name: ChessNameBlack.King,
    rank: 6,
  },
  1: {
    side: ChessSide.Black,
    name: ChessNameBlack.Guard,
    rank: 5,
  },
  2: {
    side: ChessSide.Black,
    name: ChessNameBlack.Guard,
    rank: 5,
  },
  3: {
    side: ChessSide.Black,
    name: ChessNameBlack.Minister,
    rank: 4,
  },
  4: {
    side: ChessSide.Black,
    name: ChessNameBlack.Minister,
    rank: 4,
  },
  5: {
    side: ChessSide.Black,
    name: ChessNameBlack.Chariot,
    rank: 3,
  },
  6: {
    side: ChessSide.Black,
    name: ChessNameBlack.Chariot,
    rank: 3,
  },
  7: {
    side: ChessSide.Black,
    name: ChessNameBlack.Horse,
    rank: 2,
  },
  8: {
    side: ChessSide.Black,
    name: ChessNameBlack.Horse,
    rank: 2,
  },
  9: {
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  10: {
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  11: {
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  12: {
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  13: {
    side: ChessSide.Black,
    name: ChessNameBlack.Soldier,
    rank: 1,
  },
  14: {
    side: ChessSide.Black,
    name: ChessNameBlack.Cannon,
    rank: 0,
  },
  15: {
    side: ChessSide.Black,
    name: ChessNameBlack.Cannon,
    rank: 0,
  },
  16: {
    side: ChessSide.Red,
    name: ChessNameRed.King,
    rank: 6,
  },
  17: {
    side: ChessSide.Red,
    name: ChessNameRed.Guard,
    rank: 5,
  },
  18: {
    side: ChessSide.Red,
    name: ChessNameRed.Guard,
    rank: 5,
  },
  19: {
    side: ChessSide.Red,
    name: ChessNameRed.Minister,
    rank: 4,
  },
  20: {
    side: ChessSide.Red,
    name: ChessNameRed.Minister,
    rank: 4,
  },
  21: {
    side: ChessSide.Red,
    name: ChessNameRed.Chariot,
    rank: 3,
  },
  22: {
    side: ChessSide.Red,
    name: ChessNameRed.Chariot,
    rank: 3,
  },
  23: {
    side: ChessSide.Red,
    name: ChessNameRed.Horse,
    rank: 2,
  },
  24: {
    side: ChessSide.Red,
    name: ChessNameRed.Horse,
    rank: 2,
  },
  25: {
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  26: {
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  27: {
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  28: {
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  29: {
    side: ChessSide.Red,
    name: ChessNameRed.Soldier,
    rank: 1,
  },
  30: {
    side: ChessSide.Red,
    name: ChessNameRed.Cannon,
    rank: 0,
  },
  31: {
    side: ChessSide.Red,
    name: ChessNameRed.Cannon,
    rank: 0,
  },
};
