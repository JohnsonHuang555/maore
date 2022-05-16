import { Schema, type } from '@colyseus/schema';

export interface IGameSettings {
  // 勝利分數
  winnerPoint?: number;
}

export class GameSettingsState extends Schema implements IGameSettings {
  @type('number')
  winnerPoint: number = 20;
}
