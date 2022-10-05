import { Schema, type } from '@colyseus/schema';

export interface IGameSettings {
  // 每回合秒數
  remainedSecond?: number;
  // 模式
  mode?: string;
}

export class GameSettingsState extends Schema implements IGameSettings {
  @type('number')
  remainedSecond: number = 60;

  @type('string')
  mode = 'standard';
}
