import { Schema, ArraySchema, type } from '@colyseus/schema';
import BoardCellState from './BoardCellState';

interface IPlayerInfo {
  remained: number;
  board: ArraySchema<BoardCellState>; // 自己的 board
}

export default class FindPlaneHeadState extends Schema implements IPlayerInfo {
  @type('number')
  remained: number = 3;

  @type([BoardCellState])
  board = new ArraySchema<BoardCellState>();
}
