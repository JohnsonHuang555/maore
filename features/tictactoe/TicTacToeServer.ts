import { TicTacToeMessage } from 'features/tictactoe/models/TicTacToeMessage';
import BaseServer from 'features/base/BaseServer';
import { sharedInstance as events } from 'features/base/EventCenter';

// 監聽與傳送給後端資料
export default class Server extends BaseServer {
  constructor() {
    super();
    this.handleStateChange();
  }

  makeSelection(idx: number) {
    if (this.playerInfo.playerIndex !== this.room.state.activePlayer) {
      this.showAlert('不是你的回合！');
      return;
    }

    this.room.send(TicTacToeMessage.SelectCell, { index: idx });
  }

  onBoardChanged(cb: (cell: number, index: number) => void, context?: any) {
    events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    this.room.state.board.onChange = (item, idx) => {
      events.emit('board-changed', item, idx);
    };
  }
}
