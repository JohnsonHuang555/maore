import { Schema, ArraySchema, type } from '@colyseus/schema';
import { ChessInfoState } from './ChessInfoState';

interface ChineseChess extends Schema {
  chineseChesses: ArraySchema<ChessInfoState>;
}

export default class ChineseChessState extends Schema implements ChineseChess {
  @type([ChessInfoState])
  chineseChesses = new ArraySchema<ChessInfoState>();
}
