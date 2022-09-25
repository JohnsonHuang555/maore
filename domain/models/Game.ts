import { GamePack } from 'server/domain/Game';

export type Game = {
  id: number;
  name: string;
  maxPlayers?: number;
  minPlayers?: number;
  brief: string;
  description: string;
  imageUrl: string;
  estimateTime: number;
  modes?: GameMode[];
  createAt: string;
  gamePack: GamePack;
};

export type GameMode = {
  label: string;
  value: string;
  maxPlayers: number;
  minPlayers: number;
  imageUrl: string;
};

// FIXME: 未來需要修正，目前先寫死
export const minPlayerMaps: { [key: string]: number } = {
  [GamePack.MathFormulaCard]: 2,
  [GamePack.ChineseChessHidden]: 2,
};
