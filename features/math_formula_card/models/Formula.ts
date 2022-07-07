export type Formula = {
  id: string;
  formulaType: FormulaType;
};

export enum FormulaType {
  number = 'number',
  symbol = 'symbol',
}

export type FormulaCoords = {
  pointX: number;
  pointY: number;
};
