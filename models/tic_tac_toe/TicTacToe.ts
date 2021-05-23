import { Schema, ArraySchema } from '@colyseus/schema';
import { GameState } from 'models/Room';
import { PlayerState } from 'models/Player';

export enum Cell {
  Empty,
  X,
  O,
}

export interface TicTacToe extends Schema {
  players: ArraySchema<PlayerState>;
  board: ArraySchema<Cell>;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}
