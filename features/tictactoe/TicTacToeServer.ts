import { store } from 'pages/_app';
import { Message } from 'models/messages/RoomMessage';
import BaseServer from 'features/base/BaseServer';

// 監聽與傳送給後端資料
export default class Server extends BaseServer {
  constructor() {
    super();
    this.handleStateChange();
  }

  makeSelection(idx: number) {
    if (this.playerIndex !== this.room.state.activePlayer) {
      console.warn("not this player's turn");
      return;
    }

    this.room.send(Message.PlayerSelection, { index: idx });
  }

  onBoardChanged(cb: (cell: number, index: number) => void, context?: any) {
    this.events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    this.room.state.board.onChange = (item, idx) => {
      this.events.emit('board-changed', item, idx);
    };
  }
}
