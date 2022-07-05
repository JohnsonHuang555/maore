import { Schema, type } from '@colyseus/schema';
import { MathSymbol } from '../SelectedElementsState';

// 可能為 數字牌、運算符號牌、功能牌等等
export interface IPlayerCard {
  mathSymbol1: MathSymbol;
  mathSymbol2: MathSymbol;
}

export class EasyPartState extends Schema implements IPlayerCard {
  @type('string')
  mathSymbol1: MathSymbol;

  @type('string')
  mathSymbol2: MathSymbol;

  constructor({ mathSymbol1, mathSymbol2 }: IPlayerCard) {
    super();
    this.mathSymbol1 = mathSymbol1;
    this.mathSymbol2 = mathSymbol2;
  }
}
