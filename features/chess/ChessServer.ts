import BaseServer from 'features/base/BaseServer';
import { ChessMessage } from 'models/messages/ChessMessage';
import { Chess } from './model/Chess';

// 監聽與傳送給後端資料
export default class Server extends BaseServer {
  constructor() {
    super();   
    this.handleStateChange();
  }

  getGameData() {
    this.room.send(ChessMessage.CreateGame);
  }

  makeSelection(idx: number) {
    // if (this.playerIndex !== this.room.state.activePlayer) {
    //   console.warn("not this player's turn");
    //   return;
    // }

    // this.room.send(Message.PlayerSelection, { index: idx });
  }

  onGameDataLoaded(cb: (chesses: Chess[]) => void, context?: any) {
    this.events.on('game-data-loaded', cb, context);
  }

  onChessChanged(cb: (cell: number, index: number) => void, context?: any) {
    this.events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    console.log('game page changed');

    this.room.state.chesses.onAdd = (chessInfo, idx) => {
      console.log(chessInfo, 'chessInfochessInfochessInfochessInfo')
    };
  

    this.room.state.chesses.onChange = (item, idx) => {
      this.events.emit('board-changed', item, idx);
    };
  }
}
