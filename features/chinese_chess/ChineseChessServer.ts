import BaseServer from 'features/base/BaseServer';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessMessage } from 'models/messages/ChineseChessMessage';

export default class Server extends BaseServer {
  constructor() {
    super();
    this.handleStateChange();
  }

  flipChess(id: number) {
    this.checkYourTurn();
    console.log(id, 'id');
    this.room.send(ChineseChessMessage.FlipChess, { id });
  }

  moveChess(id: number, targetX: number, targetY: number) {
    this.checkYourTurn();
    this.room.send(ChineseChessMessage.MoveChess, { id, targetX, targetY });
  }

  eatChess(id: number, targetId: number) {
    this.checkYourTurn();
    this.room.send(ChineseChessMessage.EatChess, { id, targetId });
  }

  onBoardChanged(cb: (chessInfo: ChessInfo) => void, context?: any) {
    this.events.on('board-changed', cb, context);
  }

  private checkYourTurn() {
    if (this.playerInfo.playerIndex !== this.room.state.activePlayer) {
      this.showAlert('不是你的回合！');
    }
  }

  private handleStateChange() {
    // this.room.state.chineseChesses.onChange = (chessInfo) => {
    //   console.log(chessInfo);
    //   this.events.emit('board-changed', chessInfo);
    // };
  }
}
