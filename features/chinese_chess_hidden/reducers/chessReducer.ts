import { IChessInfo } from '@server/games/chinese_chess_hidden/state/ChessInfoState';
import { ChessSide } from '../models/ChineseChessSide';

export enum ActionType {
  SetChess = 'setChess',
  UpdateChess = 'updateChess',
  UpdateChessSide = 'updateChessSide',
  SelectChess = 'selectChess',
  SetWinnerIndex = 'SetWinnerIndex',
}

type State = {
  chesses: IChessInfo[];
  yourSide: ChessSide | '';
  yourEatenChess: IChessInfo[];
  otherSide: ChessSide | '';
  otherEatenChess: IChessInfo[];
  selectedChess?: IChessInfo;
  winnerIndex: number;
};

export const initialState: State = {
  chesses: [],
  yourSide: '',
  yourEatenChess: [],
  otherSide: '',
  otherEatenChess: [],
  winnerIndex: -1,
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
  chess: IChessInfo;
};

type SetWinnerIndexAction = {
  type: ActionType.SetWinnerIndex;
  winnerIndex: number;
};

type Action =
  | SetChessAction
  | UpdateChessAction
  | UpdateChessSideAction
  | SelectChessAction
  | SetWinnerIndexAction;

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
          chess = {
            ...chess,
            ...action.chessInfo,
          };
        }
        return chess;
      });
      return {
        ...state,
        chesses: newChesses,
        selectedChess: undefined,
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
        selectedChess: action.chess ? action.chess : undefined,
      };
    }
    case ActionType.SetWinnerIndex: {
      return {
        ...state,
        winnerIndex: action.winnerIndex,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
