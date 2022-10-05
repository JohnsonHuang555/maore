import { IGameSettings } from 'server/games/chinese_chess_hidden/state/GameSettingsState';

export enum ActionType {
  UpdateChineseChess = 'updateChineseChess',
}

export const updateGameSettings = (gameSettings: Partial<IGameSettings>) => {
  return {
    type: ActionType.UpdateChineseChess,
    gameSettings,
  };
};
