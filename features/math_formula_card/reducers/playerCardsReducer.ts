import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import { OtherPlayerCard } from '../models/OtherPlayerCard';

export enum ActionType {
  DrawCard = 'DrawCard',
  UseCard = 'UseCard',
  // 其他玩家手牌只記剩餘數量就可以
  DrawOthersCard = 'DrawOthersCard',
  UseOthersCard = 'UseOthersCard',
}

export type State = {
  // 你的手牌
  yourCards: IPlayerCard[];
  // 其他玩家手牌
  otherPlayerCard: OtherPlayerCard;
};

export const initialState: State = {
  yourCards: [],
  otherPlayerCard: {},
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
  playerCard: IPlayerCard;
};

type UseOthersCardAction = {
  type: ActionType.UseOthersCard;
  playerId: string;
};

type Action =
  | DrawCardAction
  | UseCardAction
  | DrawOthersCardAction
  | UseOthersCardAction;

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
      // 新增其他玩家的牌數
      const newState = { ...state.otherPlayerCard };
      if (state.otherPlayerCard.hasOwnProperty(action.playerId)) {
        const newValue = newState[action.playerId];
        newState[action.playerId] = newValue + 1;
      } else {
        newState[action.playerId] = 1;
      }

      return {
        ...state,
        otherPlayerCard: newState,
      };
    }
    case ActionType.UseOthersCard: {
      // 扣除其他玩家的牌數
      const newState = { ...state.otherPlayerCard };
      const newValue = newState[action.playerId];
      newState[action.playerId] = newValue - 1;

      return {
        ...state,
        otherPlayerCard: newState,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
