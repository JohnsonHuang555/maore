import { StoreState } from 'reducers/rootReducer';

export const mathFormulaSettingsSelector = (store: StoreState) =>
  store.mathFormula.gameSettings;

export const chineseChessHiddenSettingsSelector = (store: StoreState) =>
  store.chineseChessHidden.gameSettings;
