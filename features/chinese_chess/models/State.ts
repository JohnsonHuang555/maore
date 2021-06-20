import { ArraySchema } from '@colyseus/schema';
import { ChessNameBlack, ChessNameRed, ChessSide } from './Chess';

export type ChessInfo = {
  id: number;
  chessSide: ChessSide;
  name: ChessNameBlack | ChessNameRed;
  isFlipped?: boolean;
  locationX: number;
  locationY: number;
  rank?: number;
  alive: boolean;
};

export interface ChineseChessState {
  chineseChesses: ArraySchema<ChessInfo>;
}
