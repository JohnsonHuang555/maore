import { Side } from "features/chess/model/Chess";
import { ArraySchema } from '@colyseus/schema';

export interface ChessInfo {
  id: number;
  x: number;
  y: number;
  side: Side;
  name: string;
};

export interface ChessState {
  chesses: ArraySchema<ChessInfo>;
}
