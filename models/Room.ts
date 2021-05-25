import { Schema, ArraySchema } from '@colyseus/schema';
import { Room as ClientRoom } from 'colyseus.js';
import { Player } from './Player';

export interface RoomType extends ClientRoom<Room> {
  metadata: Metadata;
}

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
