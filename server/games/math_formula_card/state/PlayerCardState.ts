import { Schema, type } from '@colyseus/schema';
import { PlayerCard, CardSymbol } from '../../../../features/math_formula_card/models/MathFormulaState';

export class PlayerCardState extends Schema implements PlayerCard {
  @type('number')
  cardNumber?: number;

  @type('string')
  cardSymbol?: CardSymbol;

  constructor({ cardNumber, cardSymbol }: PlayerCard) {
    super();
    this.cardNumber = cardNumber;
    this.cardSymbol = cardSymbol;
  }
}
