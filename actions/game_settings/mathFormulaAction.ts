import { IGameSettings } from 'server/games/math_formula_card/state/GameSettingsState';

export enum ActionType {
  UpdateMathFormula = 'UpdateMathFormula',
}

export const updateGameSettings = (gameSettings: Partial<IGameSettings>) => {
  return {
    type: ActionType.UpdateMathFormula,
    gameSettings,
  };
};
