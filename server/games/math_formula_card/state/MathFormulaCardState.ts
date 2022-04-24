import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import RoomState from '../../base/state/RoomState';
import { PlayerCardState } from './PlayerCardState';

interface MathFormulaCard extends Schema {
  answer: number;
  playerCards: MapSchema<ArraySchema<PlayerCardState>>;
}

export default class MathFormulaCardState
  extends RoomState
  implements MathFormulaCard
{
  @type('number')
  answer: number = 0;

  @type({ map: PlayerCardState })
  playerCards = new MapSchema<ArraySchema<PlayerCardState>>();
}
