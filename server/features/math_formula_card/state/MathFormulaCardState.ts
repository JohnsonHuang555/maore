import { Schema, ArraySchema, type } from '@colyseus/schema';
import { MathFormulaCard } from '../../../../features/math_formula_card/models/MathFormulaCard';
import RoomState from '../../base/state/RoomState';
import { PlayerCardState } from './PlayerCardState';

export default class MathFormulaCardState
  extends RoomState
  implements MathFormulaCard
{
  @type('number')
  answer: number = 0;

  @type([PlayerCardState])
  playerCards = new ArraySchema<PlayerCardState>()
}
