import { Schema, type } from '@colyseus/schema';

export enum CardSymbol {
  Plus = '+',
  Minus = '-',
  Times = '*',
  Divide = '/',
}

export const CardSymbols = [
  CardSymbol.Plus,
  CardSymbol.Minus,
  CardSymbol.Times,
  CardSymbol.Divide,
];

// 可能為 數字牌、運算符號牌、功能牌等等
export interface IPlayerCard {
  id: string;
  cardNumber?: number;
  cardSymbol?: CardSymbol;
}

export class PlayerCardState extends Schema implements IPlayerCard {
  @type('string')
  id: string;

  @type('number')
  cardNumber?: number;

  @type('string')
  cardSymbol?: CardSymbol;

  constructor({ id, cardNumber, cardSymbol }: IPlayerCard) {
    super();
    this.id = id;
    this.cardNumber = cardNumber;
    this.cardSymbol = cardSymbol;
  }
}
