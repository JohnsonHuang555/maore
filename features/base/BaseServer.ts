import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { Message } from 'models/messages/RoomMessage';
import { State } from 'reducers/gameStateReducer';
import { GameStatus } from 'models/Room';

export default class BaseServer {
  public room: ClientRoom<Room>;
  public events: Phaser.Events.EventEmitter;
  private _playerIndex = -1;
  private _gameStatus: GameStatus;
  private _gameState: State;

  get playerIndex() {
    return this._playerIndex;
  }

  get gameStatus() {
    return this._gameStatus;
  }

  // 遊戲資料
  get gameState() {
    return this._gameState;
  }

  constructor() {
    this.events = new Phaser.Events.EventEmitter();
    const { server, room, gameState } = store.getState();
    if (!server.room) {
      throw new Error('no room found...');
    }
    const playerIndex = room.players.findIndex(
      (p) => p.id === room.yourPlayerId
    );
    this._playerIndex = playerIndex;
    this._gameStatus = room.gameStatus;
    this._gameState = gameState;
    this.room = server.room;
  }

  finishGame() {
    this.room.send(Message.FinishGame);
  }

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-turn-changed', cb, context);
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-win', cb, context);
  }
}
