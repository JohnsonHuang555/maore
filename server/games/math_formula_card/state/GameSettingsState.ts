import { Schema, type } from '@colyseus/schema';

export interface IGameSettings {
  // 勝利分數
  winnerPoint?: number;
  // 每回合秒數
  remainedSecond?: number;
}

export class GameSettingsState extends Schema implements IGameSettings {
  @type('number')
  winnerPoint: number = 20;

  @type('number')
  remainedSecond: number = 60;
}
