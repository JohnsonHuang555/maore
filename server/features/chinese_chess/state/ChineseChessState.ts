import { Schema, ArraySchema, type } from '@colyseus/schema';
import { ChessInfoState } from './ChessInfoState';
import RoomState from '../../room/state/RoomState';

interface ChineseChess extends Schema {
  chineseChesses: ArraySchema<ChessInfoState>;
}

export default class ChineseChessState
  extends RoomState
  implements ChineseChess
{
  @type([ChessInfoState])
  chineseChesses = new ArraySchema<ChessInfoState>();
}
