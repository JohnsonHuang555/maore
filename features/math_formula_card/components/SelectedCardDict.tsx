import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import DivideIcon from 'features/math_formula_card/components/icons/DivideIcon';
import React from 'react';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

export const selectedCardSymbolDict: { [key: string]: React.ReactNode } = {
  [MathSymbol.Plus]: <AddIcon fontSize="large" />,
  [MathSymbol.Minus]: <RemoveIcon fontSize="large" />,
  [MathSymbol.Times]: <ClearIcon fontSize="large" />,
  [MathSymbol.Divide]: <DivideIcon />,
  [MathSymbol.LeftParentheses]: '(',
  [MathSymbol.RightParentheses]: ')',
};

export const selectedCardLabelDict: { [key: string]: string } = {
  [MathSymbol.Plus]: '加法',
  [MathSymbol.Minus]: '減法',
  [MathSymbol.Times]: '乘法',
  [MathSymbol.Divide]: '除法',
  [MathSymbol.LeftParentheses]: '左括號',
  [MathSymbol.RightParentheses]: '右括號',
};

export const getSelectedCardLabel = (value: number | MathSymbol) => {
  if (!isNaN(Number(value))) {
    return value as number;
  }
  return selectedCardSymbolDict[value];
};
