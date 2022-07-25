import { Schema, type } from '@colyseus/schema';
import { MathSymbol } from './SelectedElementsState';

export interface IMahSymbolCard {
  id: string;
  mathSymbol: MathSymbol;
}

export class MathSymbolCardState extends Schema implements IMahSymbolCard {
  @type('string')
  id: string;

  @type('string')
  mathSymbol: MathSymbol;

  constructor({ id, mathSymbol }: IMahSymbolCard) {
    super();
    this.id = id;
    this.mathSymbol = mathSymbol;
  }
}
