export interface MathFormulaState {
  answer: number;
  // playerCards:
}

export enum CardSymbol {
  Plus = 'plus',
  Minus = 'minus',
  Times = 'times',
  Divide = 'divide',
}

export interface PlayerCard {
  cardNumber?: number;
  cardSymbol?: CardSymbol;
}
