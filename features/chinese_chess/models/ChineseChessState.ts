import { ArraySchema } from '@colyseus/schema';
import { ChessNameBlack, ChessNameRed, ChessSide } from './ChineseChess';
import { ChessInfoState } from 'server/games/chinese_chess/state/ChessInfoState';
export interface ChessInfo {
  id: number;
  chessSide: ChessSide;
  name: ChessNameBlack | ChessNameRed;
  isFlipped?: boolean;
  locationX: number;
  locationY: number;
  rank?: number;
  alive: boolean;
}

export interface ChineseChessState {
  chineseChesses: ArraySchema<ChessInfoState>;
}
