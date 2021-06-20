import { ChessName, Side } from "./Chess";

export type ChessCell = {
  color: CellColor;
  chessSide?: Side;
  chessName?: ChessName;
  x: number;
  y: number;
};

export enum CellColor {
  White = 'white',
  Black = 'black',
}
