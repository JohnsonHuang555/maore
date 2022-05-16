import { IGameSettings } from 'server/games/math_formula_card/state/GameSettingsState';

export enum ActionType {
  Update = 'Update',
}

export const updateGameSettings = (gameSettings: Partial<IGameSettings>) => {
  return {
    type: ActionType.Update,
    gameSettings,
  };
};
