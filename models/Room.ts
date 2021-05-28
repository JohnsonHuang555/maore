import { Schema, ArraySchema } from '@colyseus/schema';
import { Player } from './Player';

export enum GameState {
  WaitingForPlayers,
  Playing,
  Finished,
}

export interface Room extends Schema {
  players: ArraySchema<Player>;
  gameState: GameState; // 遊戲狀態
  activePlayer: number; // 當前玩家
  winningPlayer: number; // 勝利玩家
  playerIndex: number; // 玩家順序號
}

export type Metadata = {
  roomTitle?: string;
  playerName: string;
};

export type RoomInfo = {
  roomTilte: string;
  maxPlayers: number;
};
