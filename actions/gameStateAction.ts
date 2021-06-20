import { State } from 'reducers/gameStateReducer';

export enum ActionType {
  LoadedInitalState = 'LOADED_INITIAL_STATE',
}

export const loadedInitalState = (defaultState: Partial<State>) => {
  return {
    type: ActionType.LoadedInitalState,
    defaultState,
  };
};
