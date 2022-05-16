import { StoreState } from 'reducers/rootReducer';

export const gameSettingsSelector = (store: StoreState) =>
  store.mathFormula.gameSettings;
