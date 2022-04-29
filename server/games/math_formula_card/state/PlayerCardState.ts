import { Schema, ArraySchema, type } from '@colyseus/schema';

export enum CardSymbol {
  Plus = 'plus',
  Minus = 'minus',
  Times = 'times',
  Divide = 'divide',
}

export interface IPlayerCard {
  cardNumber?: number;
  cardSymbol?: CardSymbol;
}

export class PlayerCardState extends Schema implements IPlayerCard {
  @type('number')
  cardNumber?: number;

  @type('string')
  cardSymbol?: CardSymbol;

  constructor({ cardNumber, cardSymbol }: IPlayerCard) {
    super();
    this.cardNumber = cardNumber;
    this.cardSymbol = cardSymbol;
  }
}
