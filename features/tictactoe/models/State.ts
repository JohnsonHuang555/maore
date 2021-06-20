import { Cell } from 'features/tictactoe/models/Cell';
import { ArraySchema } from '@colyseus/schema';

export interface TicTacToe {
  board: ArraySchema<Cell>;
}
