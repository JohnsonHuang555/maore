import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import { ChessInfoState } from './ChessInfoState';
import { PlayerInfoState } from './PlayerInfoState';

interface ChineseChessHidden {
  chesses: ArraySchema<ChessInfoState>;
  playerInfos: MapSchema<PlayerInfoState>;
}

export default class ChineseChessHiddenState
  extends Schema
  implements ChineseChessHidden
{
  @type([ChessInfoState])
  chesses = new ArraySchema<ChessInfoState>();

  @type({ map: PlayerInfoState })
  playerInfos = new MapSchema<PlayerInfoState>();
}
