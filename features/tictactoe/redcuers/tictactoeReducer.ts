import { ActionType } from '../actions/TicTacToeAction';
import { Cell } from '../models/Cell';

export type State = {
  board: Cell[];
};

const initialState: State = {
  board: [],
};

type UpdateBoardAction = {
  type: ActionType.UPDATE_BOARD;
  index: number;
  value: Cell;
};

type Action = UpdateBoardAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.UPDATE_BOARD: {
      const newBoard = state.board.map((b, index) => {
        if (index === action.index) {
          return action.value;
        }
        return b;
      });
      return {
        ...state,
        board: newBoard,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
