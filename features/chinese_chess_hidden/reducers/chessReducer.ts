import { ChessInfo } from '../models/ChineseChessState';

export enum ActionType {
  SetChess = 'setChess',
}

type State = {
  chesses: ChessInfo[];
};

export const initialState: State = {
  chesses: [],
};

type SetChessAction = {
  type: ActionType.SetChess;
  chess: ChessInfo;
};

type Action = SetChessAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SetChess: {
      return {
        ...state,
        chesses: [...state.chesses, action.chess],
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
