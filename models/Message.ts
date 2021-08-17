export enum RoomMessage {
  // play flow
  GetYourPlayerId = 'get-your-playerId',
  ReadyGame = 'ready-game',
  StartGame = 'start-game',
  CreatePlyayerOrder = 'create-player-order',
  FinishGame = 'finish-game',
  LoadedGame = 'Loaded-game', // 對前端來說永遠都 request true，改成 false 的情境只有在後端做
  CreateGame = 'create-game',
  UpdateRoomInfo = 'update-room-info',
  // messages
  SendMessage = 'send-message',
  GetMessages = 'get-messages',
}
