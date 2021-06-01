import { Cell } from '../models/Cell';

export enum ActionType {
  UPDATE_BOARD = 'UPDATE_BOARD',
}

export const updateBoard = (index: number, value: Cell) => {
  return {
    type: ActionType.UPDATE_BOARD,
    index,
    value,
  };
};
