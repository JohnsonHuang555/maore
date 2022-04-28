import { ActionType } from '../actions/playerCardAction';
import { PlayerCard } from '../models/MathFormulaState';

export type State = {
  player1?: PlayerCard[];
  player2?: PlayerCard[];
  player3?: PlayerCard[];
  player4?: PlayerCard[];
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
