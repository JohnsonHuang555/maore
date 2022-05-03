import {
  CardSymbol,
  IPlayerCard,
} from 'server/games/math_formula_card/state/PlayerCardState';
import { OtherPlayerDict, OthersPlayerInfo } from '../models/OtherPlayerCard';

export enum ActionType {
  DrawCard = 'DrawCard',
  UseCard = 'UseCard',
  SelectCard = 'SelectCard',
  // 其他玩家手牌只記剩餘數量就可以
  DrawOthersCard = 'DrawOthersCard',
  UseOthersCard = 'UseOthersCard',
  InitOthersPlayerInfo = 'InitOthersPlayerInfo',
  UpdateOthersPlayerInfo = 'UpdateOthersPlayerInfo',
}

type SelectedCard = {
  id: string;
  value: number | CardSymbol;
};

export type State = {
  // 你的手牌
  yourCards: IPlayerCard[];
  yourPoint: number;
  selectedCards: SelectedCard[];
  // 其他玩家手牌
  otherPlayerDict: OtherPlayerDict;
};

export const initialState: State = {
  yourCards: [],
  yourPoint: 0,
  selectedCards: [],
  otherPlayerDict: {},
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
  value: number | CardSymbol;
};

type Action =
  | DrawCardAction
  | UseCardAction
  | DrawOthersCardAction
  | UseOthersCardAction
  | InitOthersInfoAction
  | UpdateOthersInfoAction
  | SelectCardAction;

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
      return {
        ...state,
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
      const hasExist = newCards.findIndex((card) => card.id === action.id);
      if (hasExist !== -1) {
        newCards.splice(hasExist, 1);
      } else {
        newCards = [...newCards, { id: action.id, value: action.value }];
      }
      return {
        ...state,
        selectedCards: newCards,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
