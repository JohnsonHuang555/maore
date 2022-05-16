import { ActionType } from '@actions/game_settings/mathFormulaAction';
import { IGameSettings } from 'server/games/math_formula_card/state/GameSettingsState';

export type State = {
  gameSettings?: IGameSettings;
};

const initialState: State = {};

type UpdateAction = {
  type: ActionType.Update;
  gameSettings: Partial<IGameSettings>;
};

type Action = UpdateAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.Update: {
      return {
        ...state,
        gameSettings: {
          ...state.gameSettings,
          ...action.gameSettings,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
