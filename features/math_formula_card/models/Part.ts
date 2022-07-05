import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

export type EasyPart = {
  answer: number;
};

export type MediumPart = {
  answer: number;
  symbolAvailable1: MathSymbol[];
  symbolAvailable2: MathSymbol[];
};

export type HardPart = {
  answer: number;
  symbolAvailable1: MathSymbol[];
  symbolAvailable2: MathSymbol[];
  symbolAvailable3: MathSymbol[];
};
