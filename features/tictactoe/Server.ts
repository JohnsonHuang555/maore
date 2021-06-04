// 監聽與傳送給後端資料
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Message } from 'models/Message';
import { updateGameStatus } from 'actions/RoomAction';

export default class Server {
  private events: Phaser.Events.EventEmitter;
  private room: ClientRoom<Room>;
  private playerIndex = -1;

  constructor() {
    this.events = new Phaser.Events.EventEmitter();
    const { server } = store.getState();
    if (!server.room) {
      throw new Error('no room found...');
    }
    this.room = server.room;
    this.handleStateChange();
  }

  makeSelection(idx: number) {
    if (!this.room) {
      return;
    }

    if (this.playerIndex !== this.room.state.activePlayer) {
      console.warn("not this player's turn");
      return;
    }

    this.room.send(Message.PlayerSelection, { index: idx });
  }

  private handleStateChange() {
    console.log('game page changed');
    this.room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case 'gameState': {
            store.dispatch(updateGameStatus(value));
          }
        }
      });
    };
  }
}
