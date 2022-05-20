import { SelectCardSymbol } from 'server/games/math_formula_card/state/SelectedCardState';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import DivideIcon from '@components/icons/DivideIcon';
import React from 'react';

export const selectedCardSymbolDict: { [key: string]: React.ReactNode } = {
  [SelectCardSymbol.Plus]: <AddIcon fontSize="large" />,
  [SelectCardSymbol.Minus]: <RemoveIcon fontSize="large" />,
  [SelectCardSymbol.Times]: <ClearIcon fontSize="large" />,
  [SelectCardSymbol.Divide]: <DivideIcon />,
  [SelectCardSymbol.LeftParentheses]: '(',
  [SelectCardSymbol.RightParentheses]: ')',
};

export const getSelectedCardLabel = (value: number | SelectCardSymbol) => {
  if (!isNaN(Number(value))) {
    return value as number;
  }
  return selectedCardSymbolDict[value];
};
