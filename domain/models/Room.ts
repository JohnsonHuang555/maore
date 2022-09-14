import { GamePack } from 'server/domain/Game';

export enum GameStatus {
  WaitingForPlayers,
  Playing,
  // Finished
}

// RoomAvailable 使用存放到 RoomInfo
export type Metadata = {
  roomTitle?: string;
  playerName: string;
  gamePack?: GamePack;
};

// 房間頁使用
export type RoomInfo = {
  roomTitle: string;
  maxPlayers: number;
  gamePack: GamePack | '';
};

// 渲染畫面方式
export enum RenderMethod {
  WithoutFramework = 'without_framework',
  Kaboom = 'kaboom',
}
