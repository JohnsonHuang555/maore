import { Schema } from '@colyseus/schema';

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

export default Room;
