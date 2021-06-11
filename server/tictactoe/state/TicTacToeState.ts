import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../../room/state/PlayerState';
import { GameState } from '../../../models/Room';
import { RoomInfoState } from '../../room/state/RoomInfoState';
import { Cell } from '../../../features/tictactoe/models/Cell';
import RoomState from '../../room/state/RoomState';

interface TicTacToe extends Schema {
  board: ArraySchema<Cell>;
}

// export interface EnhanceTicTacToeState extends TicTacToe, RoomState {}

export default class TicTacToeState extends RoomState implements TicTacToe {
  @type(['number'])
  board: ArraySchema<number>;

  constructor() {
    super();
    this.board = new ArraySchema(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
