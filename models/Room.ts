export enum GameState {
  WaitingForPlayers,
  Playing,
  Finished,
}

export type Metadata = {
  roomTitle?: string;
  playerName: string;
};

export type RoomInfo = {
  roomTilte: string;
  maxPlayers: number;
};
