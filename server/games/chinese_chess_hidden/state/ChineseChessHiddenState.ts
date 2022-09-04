import { Schema, ArraySchema, type } from '@colyseus/schema';
import { ChessInfoState } from './ChessInfoState';

interface ChineseChessHidden {
  chesses: ArraySchema<ChessInfoState>;
}

export default class ChineseChessHiddenState
  extends Schema
  implements ChineseChessHidden
{
  @type([ChessInfoState])
  chesses = new ArraySchema<ChessInfoState>();
}
