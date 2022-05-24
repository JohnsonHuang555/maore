import { Schema, type } from '@colyseus/schema';

// 可能為 數字牌、運算符號牌、功能牌等等
export interface IPlayerCard {
  id: string;
  cardNumber: number;
}

export class PlayerCardState extends Schema implements IPlayerCard {
  @type('string')
  id: string;

  @type('number')
  cardNumber: number;

  constructor({ id, cardNumber }: IPlayerCard) {
    super();
    this.id = id;
    this.cardNumber = cardNumber;
  }
}
