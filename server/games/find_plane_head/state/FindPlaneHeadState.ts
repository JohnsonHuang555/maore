import { Schema, ArraySchema, type } from '@colyseus/schema';
import BoardCellState from './BoardCellState';

interface IFindPlaneHead {
  board: ArraySchema<BoardCellState>;
}

export default class FindPlaneHeadState
  extends Schema
  implements IFindPlaneHead
{
  @type([BoardCellState])
  board = new ArraySchema<BoardCellState>();
}
