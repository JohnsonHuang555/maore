import Phaser from 'phaser';
import { Room } from 'middleware/services/RoomServer';
import { Room as ClientRoom } from 'colyseus.js';
import { store } from 'pages/_app';
import { updateGameStatus } from 'actions/RoomAction';

export default class Server {
  private events: Phaser.Events.EventEmitter;
  private room: ClientRoom<Room>;
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
    const { server, room } = store.getState();
    if (!server.room) {
      throw new Error('no room found...');
    }
    const playerIndex = room.players.findIndex(
      (p) => p.id === room.yourPlayerId
    );
    this._playerIndex = playerIndex;
    this.room = server.room;
    this.handleStateChange();
  }

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-turn-changed', cb, context);
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-win', cb, context);
  }

  onBoardChanged(cb: (cell: number, index: number) => void, context?: any) {
    this.events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    this.room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case 'activePlayer': {
            this.events.emit('player-turn-changed', value);
            break;
          }
          case 'winningPlayer': {
            this.events.emit('player-win', value);
            break;
          }
          case 'gameState': {
            store.dispatch(updateGameStatus(value));
            break;
          }
        }
      });
    };

    this.room.state.board.onChange = (item, idx) => {
      this.events.emit('board-changed', item, idx);
    };
  }
}
