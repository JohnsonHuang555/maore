import AddIcon from 'features/math_formula_card/components/icons/PlusIcon';
import RemoveIcon from 'features/math_formula_card/components/icons/MinusIcon';
import ClearIcon from 'features/math_formula_card/components/icons/TimesIcon';
import DivideIcon from 'features/math_formula_card/components/icons/DivideIcon';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

export const selectedCardSymbolDict: { [key: string]: React.ReactNode } = {
  [MathSymbol.Plus]: <AddIcon fontSize="medium" />,
  [MathSymbol.Minus]: <RemoveIcon fontSize="medium" />,
  [MathSymbol.Times]: <ClearIcon fontSize="medium" />,
  [MathSymbol.Divide]: <DivideIcon fontSize="medium" />,
  // [MathSymbol.LeftParentheses]: '(',
  // [MathSymbol.RightParentheses]: ')',
};

export const selectedCardLabelDict: { [key: string]: string } = {
  [MathSymbol.Plus]: '加法',
  [MathSymbol.Minus]: '減法',
  [MathSymbol.Times]: '乘法',
  [MathSymbol.Divide]: '除法',
  // [MathSymbol.LeftParentheses]: '左括號',
  // [MathSymbol.RightParentheses]: '右括號',
};

export const getSelectedCardLabel = (value: number | MathSymbol) => {
  if (!isNaN(Number(value))) {
    return value as number;
  }
  return selectedCardSymbolDict[value];
};
