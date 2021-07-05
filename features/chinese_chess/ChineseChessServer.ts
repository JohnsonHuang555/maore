import BaseServer from 'features/base/BaseServer';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessMessage } from 'models/messages/ChineseChessMessage';
import { GameMode } from './models/ChinesChessMode';
import { ChineseChessGroup } from 'features/chinese_chess/models/ChineseChessGroup';
import { sharedInstance as events } from 'features/base/EventCenter';

enum ChessInfoChangeList {
  IsFlipped = 'isFlipped',
  LocationX = 'locationX',
  LocationY = 'LocationY',
  Alive = 'alive',
}

const TOTAL_CHESS_COUNT = 32;
/** 接收與傳送後端事件 */
export default class Server extends BaseServer {
  // 已選擇的棋子
  public selectedChessId?: number;

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

  get yourGroup(): ChineseChessGroup {
    return this.playerInfo.group;
  }

  setSelectedChessId(id: number) {
    this.selectedChessId = id;
  }

  getGameData() {
    const mode = this.roomInfo.gameMode as GameMode;
    this.room.send(ChineseChessMessage.CreateGame, {
      mode,
    });
  }

  flipChess(id: number) {
    if (!this.isYourTurn) {
      return;
    }
    this.room.send(ChineseChessMessage.FlipChess, { id });
  }

  moveChess(id: number, targetX: number, targetY: number) {
    if (!this.isYourTurn) {
      return;
    }
    this.room.send(ChineseChessMessage.MoveChess, { id, targetX, targetY });
  }

  eatChess(targetId: number) {
    if (!this.isYourTurn) {
      return;
    }
    this.room.send(ChineseChessMessage.EatChess, {
      id: this.selectedChessId,
      targetId,
    });
    this.selectedChessId = undefined;
  }

  onGameDataLoaded(cb: (chineseChesses: ChessInfo[]) => void, context?: any) {
    events.on('game-data-loaded', cb, context);
  }

  onBoardChanged(cb: (chessInfo: Partial<ChessInfo>) => void, context?: any) {
    events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    const chineseChesses: ChessInfo[] = [];
    this.room.state.chineseChesses.onAdd = (chessInfo, idx) => {
      chineseChesses.push({
        id: chessInfo.id,
        chessSide: chessInfo.chessSide,
        name: chessInfo.name,
        isFlipped: chessInfo.isFlipped,
        locationX: chessInfo.locationX,
        locationY: chessInfo.locationY,
        rank: chessInfo.rank,
        alive: chessInfo.alive,
      });
      if (idx === TOTAL_CHESS_COUNT - 1) {
        events.emit('game-data-loaded', chineseChesses);
      }
      chessInfo.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          switch (field) {
            case ChessInfoChangeList.IsFlipped:
              events.emit('board-changed', {
                id: chessInfo.id,
                isFlipped: value,
              });
              break;
            case ChessInfoChangeList.LocationX:
              events.emit('board-changed', {
                id: chessInfo.id,
                locationY: value,
              });
              break;
            case ChessInfoChangeList.LocationY:
              events.emit('board-changed', {
                id: chessInfo.id,
                locationX: value,
              });
              break;
            case ChessInfoChangeList.Alive:
              events.emit('board-changed', {
                id: chessInfo.id,
                alive: value,
              });
              break;
          }
        });
      };
    };
  }
}
