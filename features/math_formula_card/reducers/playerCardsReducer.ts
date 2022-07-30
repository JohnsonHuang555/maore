import { IMahSymbolCard } from 'server/games/math_formula_card/state/MathSymbolCardState';
import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';
import { OtherPlayerDict, OthersPlayerInfo } from '../models/OtherPlayerCard';

// 其他玩家手牌只記剩餘數量就可以
export enum ActionType {
  DrawCard = 'DrawCard',
  UseCard = 'UseCard',
  SelectCard = 'SelectCard',
  UpdateYourPoint = 'UpdateYourPoint',
  DrawOthersCard = 'DrawOthersCard',
  UseOthersCard = 'UseOthersCard',
  InitOthersPlayerInfo = 'InitOthersPlayerInfo',
  UpdateOthersPlayerInfo = 'UpdateOthersPlayerInfo',
  ClearErrorMsg = 'ClearErrorMsg',
  CreateAnswer = 'CreateAnswer',
  SortCard = 'SortCard',
  SetWinnerIndex = 'SetWinnerIndex',
  UpdateCanUseSymbol = 'UpdateCanUseSymbol',
}

export type SelectedCard = {
  id: string;
  cardId?: string;
  cardNumber?: number;
  mathSymbol?: MathSymbol | '';
};

export type State = {
  // 題目
  answer?: number;
  canUseMathSymbols: IMahSymbolCard[];
  // 你的手牌
  yourCards: IPlayerCard[];
  yourPoint: number;
  selectedCards: SelectedCard[];
  // 其他玩家手牌
  otherPlayerDict: OtherPlayerDict;
  // 錯誤訊息
  errorMsg: string;
  winnerIndex: number;
};

export const initialState: State = {
  canUseMathSymbols: [],
  yourCards: [],
  yourPoint: 0,
  selectedCards: [],
  otherPlayerDict: {},
  errorMsg: '',
  winnerIndex: -1,
};

type DrawCardAction = {
  type: ActionType.DrawCard;
  playerCard: IPlayerCard;
};

type UseCardAction = {
  type: ActionType.UseCard;
  cardId: string;
};

type DrawOthersCardAction = {
  type: ActionType.DrawOthersCard;
  playerId: string;
};

type UseOthersCardAction = {
  type: ActionType.UseOthersCard;
  playerId: string;
};

type InitOthersInfoAction = {
  type: ActionType.InitOthersPlayerInfo;
  playerId: string;
  name: string;
};

type UpdateOthersInfoAction = {
  type: ActionType.UpdateOthersPlayerInfo;
  playerId: string;
  playerInfo: Partial<OthersPlayerInfo>;
};

type SelectCardAction = {
  type: ActionType.SelectCard;
  id: string;
  cardId?: string;
  cardNumber?: number;
  mathSymbol?: MathSymbol;
  field: 'create' | 'update' | 'remove';
};

type ClearErrorMsgAction = {
  type: ActionType.ClearErrorMsg;
};

type UpdateYourPointAction = {
  type: ActionType.UpdateYourPoint;
  point: number;
};

type CreateAnswersAction = {
  type: ActionType.CreateAnswer;
  answer: number;
};

type SortCardAction = {
  type: ActionType.SortCard;
};

type SetWinnerIndexAction = {
  type: ActionType.SetWinnerIndex;
  winnerIndex: number;
};

type UpdateCanUseSymbolAction = {
  type: ActionType.UpdateCanUseSymbol;
  id?: string;
  symbol?: MathSymbol;
  field: 'create' | 'update';
};

type Action =
  | DrawCardAction
  | UseCardAction
  | DrawOthersCardAction
  | UseOthersCardAction
  | InitOthersInfoAction
  | UpdateOthersInfoAction
  | SelectCardAction
  | ClearErrorMsgAction
  | UpdateYourPointAction
  | CreateAnswersAction
  | SortCardAction
  | SetWinnerIndexAction
  | UpdateCanUseSymbolAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.DrawCard: {
      // 新增一張牌
      return {
        ...state,
        yourCards: [...state.yourCards, action.playerCard],
      };
    }
    case ActionType.UseCard: {
      // 使用一張牌
      const newCards = state.yourCards.filter(
        (card) => card.id !== action.cardId
      );
      return {
        ...state,
        yourCards: newCards,
      };
    }
    case ActionType.DrawOthersCard: {
      // 其他玩家抽牌
      const newState = { ...state.otherPlayerDict };
      newState[action.playerId].remainCardCount++;
      return {
        ...state,
        otherPlayerDict: newState,
      };
    }
    case ActionType.UseOthersCard: {
      // 其他玩家出牌
      const newState = { ...state.otherPlayerDict };
      newState[action.playerId].remainCardCount--;
      return {
        ...state,
        otherPlayerDict: newState,
      };
    }
    case ActionType.InitOthersPlayerInfo: {
      // 初始化玩家資訊
      const newState = { ...state.otherPlayerDict };
      newState[action.playerId] = {
        remainCardCount: 0,
        name: action.name,
        point: 0,
        isNowTurn: false,
      };
      return {
        ...state,
        otherPlayerDict: newState,
      };
    }
    case ActionType.UpdateOthersPlayerInfo: {
      // 更新其他玩家的資訊
      const newState = { ...state.otherPlayerDict };
      newState[action.playerId] = {
        ...newState[action.playerId],
        ...action.playerInfo,
      };

      return {
        ...state,
        otherPlayerDict: newState,
      };
    }
    case ActionType.SelectCard: {
      let newCards = [...state.selectedCards];
      switch (action.field) {
        case 'create': {
          newCards = [...newCards, { id: action.id }];
          break;
        }
        case 'update': {
          const cardIndex = newCards.findIndex((card) => card.id === action.id);
          if (action.cardId !== undefined) {
            newCards[cardIndex].cardId = action.cardId;
          }
          if (action.cardNumber !== undefined) {
            newCards[cardIndex].cardNumber = action.cardNumber;
          }
          if (action.mathSymbol !== undefined) {
            newCards[cardIndex].mathSymbol = action.mathSymbol;
          }
          break;
        }
        case 'remove': {
          const cardIndex = newCards.findIndex((card) => card.id === action.id);
          newCards.splice(cardIndex, 1);
          break;
        }
      }

      return {
        ...state,
        selectedCards: newCards,
      };
    }
    case ActionType.ClearErrorMsg: {
      return {
        ...state,
        errorMsg: '',
      };
    }
    case ActionType.UpdateYourPoint: {
      return {
        ...state,
        yourPoint: action.point,
      };
    }
    case ActionType.CreateAnswer: {
      return {
        ...state,
        answer: action.answer,
      };
    }
    case ActionType.SortCard: {
      const sortedCards = state.yourCards
        .filter((card) => !isNaN(Number(card.cardNumber)))
        .sort((a, b) => {
          const numberA = a.cardNumber as number;
          const numberB = b.cardNumber as number;
          if (numberA < numberB) {
            return -1;
          }
          if (numberA > numberB) {
            return 1;
          }
          return 0;
        });

      return {
        ...state,
        yourCards: sortedCards,
      };
    }
    case ActionType.SetWinnerIndex: {
      return {
        ...state,
        winnerIndex: action.winnerIndex,
      };
    }
    case ActionType.UpdateCanUseSymbol: {
      let newCards = [...state.canUseMathSymbols];
      switch (action.field) {
        case 'create': {
          newCards = [
            ...newCards,
            {
              id: action.id as string,
              mathSymbol: action.symbol as MathSymbol,
            },
          ];
          break;
        }
        case 'update': {
          const cardIndex = newCards.findIndex(
            (card) => card.mathSymbol === action.symbol
          );
          if (cardIndex !== -1) {
            newCards[cardIndex].id = action.id as string;
          }
          break;
        }
      }
      return {
        ...state,
        canUseMathSymbols: newCards,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
