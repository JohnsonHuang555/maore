import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import { ActionType } from '../actions/playerCardAction';

export type State = {
  yourHandCards?: IPlayerCard[];
};

export const initialState: State = {};

type InitPlayerCards = {
  type: ActionType.InitPlayerCards;
  playersCount: number;
};

type Action = InitPlayerCards;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.InitPlayerCards: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
