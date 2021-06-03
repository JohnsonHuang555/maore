import { Cell } from '../models/Cell';

export enum ActionType {
  INITIAL_GAME = 'INITIAL_GAME',
  PLAYER_SELECTION = 'PLAYER_SELECTION',
}

export const initialGame = () => {
  return {
    type: ActionType.INITIAL_GAME,
  };
};

export const makeSelection = (index: number, value: Cell) => {
  return {
    type: ActionType.PLAYER_SELECTION,
    index,
    value,
  };
};
