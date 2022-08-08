export enum RoomMessage {
  // play flow
  GetYourPlayerId = 'get-your-playerId',
  ReadyGame = 'ready-game',
  StartGame = 'start-game',
  CreatePlayerOrder = 'create-player-order',
  FinishGame = 'finish-game',
  PlayerLeft = 'player-left',
  // 對前端來說永遠都 request true，改成 false 的情境只有在後端做 後端修改 gameLoaded 值
  LoadedGame = 'loaded-game',
  CreateGame = 'create-game',
  UpdateRoomInfo = 'update-room-info',
  // messages
  SendMessage = 'send-message',
  GetMessages = 'get-messages',
  // game settings
  UpdateGameSettings = 'update-game-settings',
  // timer
  SetTimer = 'SetTimer',
  GetTimer = 'GetTimer',
  ClearTimer = 'ClearTimer',
}
