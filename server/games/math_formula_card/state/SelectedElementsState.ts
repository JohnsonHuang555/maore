import { Schema, type } from '@colyseus/schema';

export enum MathSymbol {
  Plus = '+',
  Minus = '-',
  Times = '*',
  Divide = '/',
  LeftParentheses = '(',
  RightParentheses = ')',
}

// 可能為 數字牌、運算符號牌、功能牌等等
export interface ISelectedCard {
  id: string;
  cardNumber?: number;
  mathSymbol?: MathSymbol;
}

export class SelectedElementsState extends Schema implements ISelectedCard {
  @type('string')
  id: string;

  @type('number')
  cardNumber?: number;

  @type('string')
  mathSymbol?: MathSymbol;

  constructor({ id, cardNumber, mathSymbol }: ISelectedCard) {
    super();
    this.id = id;
    this.cardNumber = cardNumber;
    this.mathSymbol = mathSymbol;
  }
}
