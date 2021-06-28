import BaseServer from 'features/base/BaseServer';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessMessage } from 'models/messages/ChineseChessMessage';
import { GameMode } from './models/Mode';

enum ChessInfoChangeList {
  IsFlipped = 'isFlipped',
  LocationX = 'locationX',
  LocationY = 'LocationY',
  Alive = 'alive',
}
export default class Server extends BaseServer {
  public chineseChesses: ChessInfo[] = [];

  constructor() {
    super();
    this.handleStateChange();
  }

  getGameData() {
    const mode = this.roomInfo.gameMode as GameMode;
    this.room.send(ChineseChessMessage.CreateGame, {
      mode,
    });
  }

  flipChess(id: number) {
    this.checkYourTurn();
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

  onBoardChanged(cb: (chessInfo: Partial<ChessInfo>) => void, context?: any) {
    this.events.on('board-changed', cb, context);
  }

  private checkYourTurn() {
    if (this.playerInfo.playerIndex !== this.room.state.activePlayer) {
      this.showAlert('不是你的回合！');
    }
  }

  private handleStateChange() {
    this.room.state.chineseChesses.onAdd = (chessInfo) => {
      console.log(chessInfo);
      this.chineseChesses.push(chessInfo);
      chessInfo.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          switch (field) {
            case ChessInfoChangeList.IsFlipped:
              console.log(value);
              this.events.emit('board-changed', { isFlipped: value });
              break;
            case ChessInfoChangeList.LocationX:
              this.events.emit('board-changed', { locationY: value });
              break;
            case ChessInfoChangeList.LocationY:
              this.events.emit('board-changed', { locationX: value });
              break;
            case ChessInfoChangeList.Alive:
              this.events.emit('board-changed', { alive: value });
              break;
          }
        });
      };
    };
  }
}
