import { Schema } from '@colyseus/schema';
import { Room as ClientRoom } from 'colyseus.js';

export interface RoomType extends ClientRoom<Room> {
  metadata: Metadata;
}

export enum GameState {
  WaitingForPlayers,
  Playing,
  Finished,
}

export interface Room extends Schema {
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}

export type Metadata = {
  roomTitle: string;
};
