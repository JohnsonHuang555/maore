import { Schema, ArraySchema } from '@colyseus/schema';
import { GameState } from 'models/Room';

export enum Cell {
  Empty,
  X,
  O,
}

export interface TicTacToe extends Schema {
  board: ArraySchema<Cell>;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}
