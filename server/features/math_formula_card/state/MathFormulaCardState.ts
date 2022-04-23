import { Schema, ArraySchema, type } from '@colyseus/schema';
import RoomState from '../../base/state/RoomState';
import { PlayerCardState } from './PlayerCardState';

interface MathFormulaCard extends Schema {
  answer: number;
  playerCards: ArraySchema<PlayerCardState>;
}

export default class MathFormulaCardState
  extends RoomState
  implements MathFormulaCard
{
  @type('number')
  answer: number = 0;

  @type([PlayerCardState])
  playerCards = new ArraySchema<PlayerCardState>()
}
