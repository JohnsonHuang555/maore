import BaseServer from 'features/base/BaseServer';
import { ChessMessage } from 'features/chess/model/ChessMessage';
import { Chess, Side } from './model/Chess';
import { sharedInstance as events } from 'features/base/EventCenter';

export type ChangedChessState = {
  actionType: ChessMessage;
  chessState: Partial<Chess>;
};

const TOTAL_CHESS_COUNT = 32;

// 監聽與傳送給後端資料
export default class Server extends BaseServer {
  // 已選擇的棋子
  public selectedChessId?: number;
  // 當更新棋子時，會有值
  public changedChessState?: ChangedChessState;
  // 暫存因為更新不會打整包，如果 ID 沒變代表同一組資料
  private tempChessState?: Partial<Chess>;

  constructor() {
    super();   
    this.handleStateChange();
  }

  get isYourTurn() {
    if (this.playerInfo.playerIndex !== this.room.state.activePlayer) {
      this.showAlert('不是你的回合！');
      return false;
    }
    return true;
  }

  get yourSide(): Side {
    return this.playerInfo.group as Side;
  }

  setSelectedChessId(id: number | undefined) {
    this.selectedChessId = id;
  }

  setChangedChessState(chessState: Partial<Chess>) {
    this.tempChessState = {
      ...this.tempChessState,
      ...chessState,
    };
    const { x, y, alive } = this.tempChessState;
    if (x && y && alive) {
      // 吃棋
      this.changedChessState = {
        actionType: ChessMessage.EatChess,
        chessState: { ...this.tempChessState },
      };
    } else if (x && y) {
      // 移動
      this.changedChessState = {
        actionType: ChessMessage.EatChess,
        chessState: { ...this.tempChessState },
      };
    }
  }

  clearChangedChessInfo() {
    this.tempChessState = undefined;
    this.changedChessState = undefined;
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
    events.on('game-data-loaded', cb, context);
  }

  onChessChanged(cb: (cell: number, index: number) => void, context?: any) {
    events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    // console.log('game page changed');
    const chesses: Chess[] = [];

    this.room.state.chesses.onAdd = (chessState, idx) => {
      const {
        id,
        x,
        y,
        side,
        name,
        alive,
      } = chessState;

      chesses.push({
        id,
        x,
        y,
        side,
        name,
        alive,
      });

      if (idx === TOTAL_CHESS_COUNT - 1) {
        events.emit('game-data-loaded', chesses);
      }
    };
  

    this.room.state.chesses.onChange = (item, idx) => {
      events.emit('board-changed', item, idx);
    };
  }
}
