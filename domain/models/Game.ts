import { GameList } from 'server/domain/Game';

export type Game = {
  id: number;
  name: string;
  maxPlayers?: number; // 該遊戲沒有模式時有值
  minPlayers?: number; // 該遊戲沒有模式時有值
  brief: string;
  description: string;
  imageUrl: string;
  estimateTime: number;
  modes?: GameMode[];
  createAt: string;
  gamePack: GameList;
};

export type GameMode = {
  label: string;
  value: string;
  maxPlayers: number;
  minPlayers: number;
  imageUrl: string;
};
