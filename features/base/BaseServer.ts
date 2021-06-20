import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { Message } from 'models/messages/RoomMessage';

export default class BaseServer {
  public room: ClientRoom<Room>;
  public events: Phaser.Events.EventEmitter;
  private _playerIndex = -1;

  get playerIndex() {
    return this._playerIndex;
  }

  get gameState() {
    const { room } = store.getState();
    return room.gameStatus;
  }

  constructor() {
    this.events = new Phaser.Events.EventEmitter();
    const { server, room, gameState } = store.getState();
    console.log(gameState);
    if (!server.room) {
      throw new Error('no room found...');
    }
    const playerIndex = room.players.findIndex(
      (p) => p.id === room.yourPlayerId
    );
    this._playerIndex = playerIndex;
    this.room = server.room;
  }

  resetGame() {
    this.room.send(Message.PlayAgain);
  }

  closeGame() {
    this.room.send(Message.CloseGame);
  }

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-turn-changed', cb, context);
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-win', cb, context);
  }
}
