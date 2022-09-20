import { IChessInfo } from '@server/games/chinese_chess_hidden/state/ChessInfoState';
import { ChessSide } from '../models/ChineseChessSide';

export enum ActionType {
  SetChess = 'setChess',
  UpdateChess = 'updateChess',
  UpdateChessSide = 'updateChessSide',
  SelectChess = 'selectChess',
}

type State = {
  chesses: IChessInfo[];
  yourSide: ChessSide | '';
  yourEatenChess: IChessInfo[];
  otherSide: ChessSide | '';
  otherEatenChess: IChessInfo[];
  selectedChessId?: string;
};

export const initialState: State = {
  chesses: [],
  yourSide: '',
  yourEatenChess: [],
  otherSide: '',
  otherEatenChess: [],
};

type SetChessAction = {
  type: ActionType.SetChess;
  chess: IChessInfo;
};

type UpdateChessAction = {
  type: ActionType.UpdateChess;
  id: string;
  chessInfo: Partial<IChessInfo>;
};

type UpdateChessSideAction = {
  type: ActionType.UpdateChessSide;
  isYou: boolean;
  chessSide: ChessSide;
};

type SelectChessAction = {
  type: ActionType.SelectChess;
  id: string;
};

type Action =
  | SetChessAction
  | UpdateChessAction
  | UpdateChessSideAction
  | SelectChessAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SetChess: {
      return {
        ...state,
        chesses: [...state.chesses, action.chess],
      };
    }
    case ActionType.UpdateChess: {
      const newChesses = state.chesses.map((chess) => {
        if (chess.id === action.id) {
          return {
            ...chess,
            ...action.chessInfo,
          };
        }
        return chess;
      });
      return {
        ...state,
        chesses: newChesses,
      };
    }
    case ActionType.UpdateChessSide: {
      if (action.isYou) {
        return {
          ...state,
          yourSide: action.chessSide,
        };
      }
      return {
        ...state,
        otherSide: action.chessSide,
      };
    }
    case ActionType.SelectChess: {
      return {
        ...state,
        selectedChessId: action.id ? action.id : undefined,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
