import { ChineseChessState } from 'features/chinese_chess/models/State';
import { TicTacToeState } from 'features/tictactoe/models/State';
import { ArraySchema } from '@colyseus/schema';
import { ActionType } from 'actions/gameStateAction';

export interface State extends TicTacToeState, ChineseChessState {}

const initialState: State = {
  board: new ArraySchema(),
  chineseChesses: new ArraySchema(),
};

type LoadedInitalStateAction = {
  type: ActionType.LoadedInitalState;
  defaultState: Partial<State>;
};

type Action = LoadedInitalStateAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.LoadedInitalState: {
      return {
        ...state,
        ...action.defaultState,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
