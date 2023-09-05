import { ActionType } from '@actions/game_settings/chineseChessHiddenAction';
import { IGameSettings } from 'server/games/chinese_chess_hidden/state/GameSettingsState';

export type State = {
  gameSettings?: IGameSettings;
};

const initialState: State = {};

type UpdateAction = {
  type: ActionType.UpdateChineseChess;
  gameSettings: Partial<IGameSettings>;
};

type Action = UpdateAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.UpdateChineseChess: {
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
