import { Schema, ArraySchema } from '@colyseus/schema';
import { Room as ClientRoom } from 'colyseus.js';
import { PlayerState } from './Player';

export interface RoomType extends ClientRoom<Room> {
  metadata: Metadata;
}

export enum GameState {
  WaitingForPlayers,
  Playing,
  Finished,
}

export interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}

export type Metadata = {
  roomTitle: string;
};
