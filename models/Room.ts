import { GameList } from './Game';

export enum GameState {
  WaitingForPlayers,
  Playing,
  Finished,
}

export type Metadata = {
  roomTitle?: string;
  playerName: string;
  gamePack?: GameList;
};

export type RoomInfo = {
  roomTilte: string;
  maxPlayers: number;
  gamePack?: GameList;
};
