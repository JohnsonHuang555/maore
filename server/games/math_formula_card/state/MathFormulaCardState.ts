import { Schema, ArraySchema, type } from '@colyseus/schema';
import { MathFormulaCard } from '../../../../features/math_formula_card/models/MathFormulaCard';
import RoomState from '../../../room/state/RoomState';

export default class MathFormulaCardState
  extends RoomState
  implements MathFormulaCard
{
  @type('number')
  answer: number = 0;
}
