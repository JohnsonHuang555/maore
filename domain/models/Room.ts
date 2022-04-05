import { GameList } from './Game';

export enum GameStatus {
  WaitingForPlayers,
  Playing,
  // Finished
}

export type Metadata = {
  roomTitle?: string;
  playerName: string;
  gamePack?: GameList;
  gameMode?: string;
};

export type RoomInfo = {
  roomTitle: string;
  maxPlayers: number;
  gamePack: GameList | '';
  gameMode?: string;
  extraSettings?: string; // JSON.stringify
};

// 渲染畫面方式
export enum RenderMethod {
  Phaser = 'phaser',
  WithoutFramework = 'without_framework',
  Kaboom = 'kaboom',
}
