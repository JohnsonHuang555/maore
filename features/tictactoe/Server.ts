import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Message } from 'models/Message';
import { updateGameStatus } from 'actions/RoomAction';

// 監聽與傳送給後端資料
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
    console.log(playerIndex, 'pi');
    this._playerIndex = playerIndex;
    this.room = server.room;
    this.handleStateChange();
  }

  makeSelection(idx: number) {
    console.log(this.playerIndex, this.room.state.activePlayer);
    if (this.playerIndex !== this.room.state.activePlayer) {
      console.warn("not this player's turn");
      return;
    }

    this.room.send(Message.PlayerSelection, { index: idx });
  }

  resetGame() {
    this.room.send(Message.ResetGame);
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
    console.log('game page changed');
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
