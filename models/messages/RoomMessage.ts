export enum RoomMessage {
  GetYourPlayerId = 'get-your-playerId',
  ReadyGame = 'ready-game',
  StartGame = 'start-game',
  CreatePlyayerOrder = 'create-player-order',
  FinishGame = 'finish-game',
  UpdateGameMode = 'update-game-mode',
  LoadedGame = 'Loaded-game', // 對前端來說永遠都 request true，改成 false 的情境只有在後端做
}
