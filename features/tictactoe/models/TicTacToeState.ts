import { Cell } from 'features/tictactoe/@models/Cell';
import { ArraySchema } from '@colyseus/schema';

export interface TicTacToeState {
  board: ArraySchema<Cell>;
}
