import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import RoomState from '../../base/state/RoomState';
import { PlayerInfoState } from './PlayerInfoState';

export interface IMathFormulaCard extends Schema {
  answers: ArraySchema<number>;
  playerInfos: MapSchema<PlayerInfoState>;
}

export default class MathFormulaCardState
  extends RoomState
  implements IMathFormulaCard
{
  @type(['number'])
  answers = new ArraySchema<number>();

  @type({ map: PlayerInfoState })
  playerInfos = new MapSchema<PlayerInfoState>();
}
