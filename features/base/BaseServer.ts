import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { State } from 'reducers/gameStateReducer';
import { GameStatus } from 'models/Room';
import { RoomMessage } from 'models/messages/RoomMessage';
import { Player } from 'models/Player';
export default class BaseServer {
  public room: ClientRoom<Room>;
  public events = new Phaser.Events.EventEmitter();
  private _playerInfo: Player;
  private _gameStatus: GameStatus;
  private _gameState: State;

  get playerIndex() {
    return this._playerInfo;
  }

  // 遊戲狀態
  get gameStatus() {
    return this._gameStatus;
  }

  // 遊戲資料
  get gameState() {
    return this._gameState;
  }

  get playerInfo() {
    return this._playerInfo;
  }

  constructor() {
    const { server, room, gameState } = store.getState();
    if (!server.room) {
      throw new Error('room not found...');
    }
    const playerInfo = room.players.find((p) => p.id === room.yourPlayerId);
    if (!playerInfo) {
      throw new Error('player not found...');
    }
    this._playerInfo = playerInfo;
    this._gameStatus = room.gameStatus;
    this._gameState = gameState;
    this.room = server.room;
    // 監聽 state 的變化
    store.subscribe(this.handleRoomStateChange);
  }

  createPlayerOrder() {
    this.room.send(RoomMessage.CreatePlyayerOrder);
  }

  finishGame() {
    this.room.send(RoomMessage.FinishGame);
  }

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-turn-changed', cb, context);
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-win', cb, context);
  }

  private handleRoomStateChange = () => {
    const {
      room: { winningPlayer },
    } = store.getState();
    this.events.emit('player-win', winningPlayer);
  };
}
