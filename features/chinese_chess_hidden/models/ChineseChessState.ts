import { ArraySchema } from '@colyseus/schema';
import { ChessNameBlack, ChessNameRed } from './ChineseChessName';
import { ChessInfoState } from 'server/games/chinese_chess/state/ChessInfoState';
import { ChessSide } from './ChineseChessSide';

export interface ChessInfo {
  id: string;
  chessSide: ChessSide;
  name: ChessNameBlack | ChessNameRed;
  isFlipped: boolean;
  locationX: number;
  locationY: number;
  rank: number;
  alive: boolean;
}

export interface ChineseChessState {
  chineseChesses: ArraySchema<ChessInfoState>;
}
