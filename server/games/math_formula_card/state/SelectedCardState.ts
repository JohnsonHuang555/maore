import { Schema, type } from '@colyseus/schema';

export enum SelectCardSymbol {
  Plus = '+',
  Minus = '-',
  Times = '*',
  Divide = '/',
  LeftParentheses = '(',
  RightParentheses = ')',
}

// 可能為 數字牌、運算符號牌、功能牌等等
export interface ISelectCard {
  id: string;
  cardNumber?: number;
  cardSymbol?: SelectCardSymbol;
}

export class SelectedCardState extends Schema implements ISelectCard {
  @type('string')
  id: string;

  @type('number')
  cardNumber?: number;

  @type('string')
  cardSymbol?: SelectCardSymbol;

  constructor({ id, cardNumber, cardSymbol }: ISelectCard) {
    super();
    this.id = id;
    this.cardNumber = cardNumber;
    this.cardSymbol = cardSymbol;
  }
}
