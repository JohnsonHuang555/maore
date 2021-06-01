import { Cell } from '../models/Cell';

export enum ActionType {
  PLAYER_SELECTION = 'PLAYER_SELECTION',
}

export const makeSelection = (index: number, value: Cell) => {
  return {
    type: ActionType.PLAYER_SELECTION,
    index,
    value,
  };
};
