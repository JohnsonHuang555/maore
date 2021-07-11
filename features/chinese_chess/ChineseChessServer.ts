import BaseServer from 'features/base/BaseServer';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessMessage } from 'features/chinese_chess/models/ChineseChessMessage';
import { GameMode } from './models/ChinesChessMode';
import { ChineseChessGroup } from 'features/chinese_chess/models/ChineseChessGroup';
import { sharedInstance as events } from 'features/base/EventCenter';
import { RoomMessage } from 'models/Message';

export type ChangedChessInfo = {
  actionType: ChineseChessMessage;
  chessInfo: Partial<ChessInfo>;
};

enum ChessInfoChangeList {
  IsFlipped = 'isFlipped',
  LocationX = 'locationX',
  LocationY = 'LocationY',
  Alive = 'alive',
}

const TOTAL_CHESS_COUNT = 32;
/** 接收與傳送後端事件 */
export default class ChineseChessServer extends BaseServer {
  // 已選擇的棋子
  public selectedChessId?: number;
  // 當更新棋子時，會有值
  public changedChessInfo?: ChangedChessInfo;
  // 暫存因為更新不會打整包，如果 ID 沒變代表同一組資料
  private tempChessInfo?: Partial<ChessInfo>;

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
    return this.playerInfo.group as ChineseChessGroup;
  }

  setSelectedChessId(id: number | undefined) {
    this.selectedChessId = id;
  }

  setChangedChessInfo(chessInfo: Partial<ChessInfo>) {
    this.tempChessInfo = {
      ...this.tempChessInfo,
      ...chessInfo,
    };
    const { isFlipped, locationX, locationY, alive } = this.tempChessInfo;
    if (isFlipped) {
      // 翻牌
      this.changedChessInfo = {
        actionType: ChineseChessMessage.FlipChess,
        chessInfo: { ...this.tempChessInfo },
      };
    } else if (locationX && locationY && alive) {
      // 吃棋
      this.changedChessInfo = {
        actionType: ChineseChessMessage.EatChess,
        chessInfo: { ...this.tempChessInfo },
      };
    } else if (locationX && locationY) {
      // 移動
      this.changedChessInfo = {
        actionType: ChineseChessMessage.EatChess,
        chessInfo: { ...this.tempChessInfo },
      };
    }
  }

  clearChangedChessInfo() {
    this.tempChessInfo = undefined;
    this.changedChessInfo = undefined;
  }

  getGameData() {
    const mode = this.roomInfo.gameMode as GameMode;
    this.room.send(RoomMessage.CreateGame, {
      mode,
    });
  }

  flipChess(id: number) {
    this.room.send(ChineseChessMessage.FlipChess, { id });
    this.setSelectedChessId(undefined);
  }

  moveChess(id: number, targetX: number, targetY: number) {
    this.room.send(ChineseChessMessage.MoveChess, { id, targetX, targetY });
  }

  eatChess(targetId: number) {
    console.log(targetId, 'asd');
    this.room.send(ChineseChessMessage.EatChess, {
      id: this.selectedChessId,
      targetId,
    });
    this.selectedChessId = undefined;
  }

  onGameDataLoaded(cb: (chineseChesses: ChessInfo[]) => void, context?: any) {
    events.on('game-data-loaded', cb, context);
  }

  private handleStateChange() {
    const chineseChesses: ChessInfo[] = [];
    this.room.state.chineseChesses.onAdd = (chessInfo) => {
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

      if (chineseChesses.length === TOTAL_CHESS_COUNT) {
        events.emit('game-data-loaded', chineseChesses);
      }
      chessInfo.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          switch (field) {
            case ChessInfoChangeList.IsFlipped:
              this.setChangedChessInfo({
                id: chessInfo.id,
                isFlipped: value,
              });
              break;
            case ChessInfoChangeList.LocationX:
              this.setChangedChessInfo({
                id: chessInfo.id,
                locationX: value,
              });
              break;
            case ChessInfoChangeList.LocationY:
              this.setChangedChessInfo({
                id: chessInfo.id,
                locationY: value,
              });
              break;
            case ChessInfoChangeList.Alive:
              this.setChangedChessInfo({
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
