import { Schema, MapSchema, type } from '@colyseus/schema';
import { PlayerInfoState } from './PlayerInfoState';

interface IMathFormulaCard {
  answer?: number;
  playerInfos: MapSchema<PlayerInfoState>;
}

export default class MathFormulaCardState
  extends Schema
  implements IMathFormulaCard
{
  @type('number')
  answer?: number;

  @type({ map: PlayerInfoState })
  playerInfos = new MapSchema<PlayerInfoState>();
}
