import BaseServer from 'features/base/BaseServer';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessMessage } from 'features/chinese_chess/models/ChineseChessMessage';
import { GameMode } from './models/ChinesChessMode';
import { ChineseChessGroup } from 'features/chinese_chess/models/ChineseChessGroup';
import { sharedInstance as events } from 'features/base/EventCenter';
import { RoomMessage } from 'models/Message';
import ChangedChessInfoFactory, {
  ChangedChessInfo,
} from './factories/ChangedChessInfoFactory';
import { ChessNameBlack, ChessNameRed } from './models/ChineseChessName';
import { CheckMoveRange } from './utils/CheckMoveRange';

enum ChessInfoChangeList {
  IsFlipped = 'isFlipped',
  LocationX = 'locationX',
  LocationY = 'locationY',
  Alive = 'alive',
}

const TOTAL_CHESS_COUNT = 32;
/** 接收與傳送後端事件 */
export default class ChineseChessServer extends BaseServer {
  // 已選擇的棋子
  public selectedChessId?: number;
  // 當更新棋子時，會有值
  public changedChessInfo?: ChangedChessInfo;
  private chineseChesses: ChessInfo[] = [];

  constructor() {
    super();
    this.handleStateChange();
  }

  get yourGroup(): ChineseChessGroup {
    return this.playerInfo.group as ChineseChessGroup;
  }

  setSelectedChessId(id: number | undefined) {
    this.selectedChessId = id;
  }

  setChangedChessInfo(chessInfo: Partial<ChessInfo>) {
    const isHiddenMode = this.roomInfo.gameMode === GameMode.Hidden;
    this.changedChessInfo = ChangedChessInfoFactory.getChangedChessInfo(
      chessInfo,
      this.chineseChesses,
      isHiddenMode
    );
  }

  clearChangedChessInfo() {
    ChangedChessInfoFactory.clearTempChessInfo();
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

  moveChess(targetX: number, targetY: number) {
    this.room.send(ChineseChessMessage.MoveChess, {
      id: this.selectedChessId,
      targetX,
      targetY,
    });
    this.setSelectedChessId(undefined);
  }

  eatChess(chessInfo: ChessInfo) {
    const {
      id: targetId,
      rank: targetRank,
      locationX: targetX,
      locationY: targetY,
      name: targetChessName,
    } = chessInfo;
    if (!this.selectedChessId) {
      return;
    }
    // 取得前一個棋子
    const { name, locationX, locationY, rank } = this.getChessById(
      this.selectedChessId
    );
    const canMove = this.canMoveChess(
      name,
      locationX,
      locationY,
      targetX,
      targetY
    );
    if (!canMove) {
      return;
    }
    const canEat = this.canEatChess(name, targetChessName, rank, targetRank);
    if (!canEat) {
      return;
    }
    this.room.send(ChineseChessMessage.EatChess, {
      id: this.selectedChessId,
      targetId,
    });
    this.setSelectedChessId(undefined);
  }

  onGameDataLoaded(cb: (chineseChesses: ChessInfo[]) => void, context?: any) {
    events.on('game-data-loaded', cb, context);
  }

  private getChessById(id: number): ChessInfo {
    const chess = this.chineseChesses.find((c) => c.id === id);
    if (!chess) {
      throw new Error('Chess not found');
    }
    return chess;
  }

  private canMoveChess(
    chessName: ChessNameBlack | ChessNameRed,
    locationX: number,
    locationY: number,
    targetX: number,
    targetY: number
  ): boolean {
    switch (this.roomInfo.gameMode) {
      case GameMode.Standard: {
        return false;
      }
      case GameMode.Hidden: {
        if (
          chessName !== ChessNameBlack.Cannon &&
          chessName !== ChessNameRed.Cannon
        ) {
          const range = CheckMoveRange.shortCross(locationX, locationY);
          return CheckMoveRange.isInRange(range, targetX, targetY);
        }
        return false;
      }
      default: {
        return false;
      }
    }
  }

  private canEatChess(
    chessName: ChessNameBlack | ChessNameRed,
    targetChessName: ChessNameBlack | ChessNameRed,
    rank?: number,
    targetRank?: number
  ): boolean {
    switch (this.roomInfo.gameMode) {
      case GameMode.Standard: {
        return false;
      }
      case GameMode.Hidden: {
        if (rank === undefined || targetRank === undefined) {
          return false;
        }
        if (
          chessName === ChessNameBlack.Cannon ||
          chessName === ChessNameRed.Cannon
        ) {
          // TODO: 判斷有無隔一個
          return true;
        }
        if (
          (chessName === ChessNameBlack.Soldier &&
            targetChessName === ChessNameRed.King) ||
          (chessName === ChessNameRed.Soldier &&
            targetChessName === ChessNameBlack.King)
        ) {
          return true;
        }
        if (rank >= targetRank) {
          return true;
        }
        return false;
      }
      default: {
        return false;
      }
    }
  }

  private handleStateChange() {
    this.room.state.chineseChesses.onAdd = (chessInfo, idx) => {
      this.chineseChesses.push({
        id: chessInfo.id,
        chessSide: chessInfo.chessSide,
        name: chessInfo.name,
        isFlipped: chessInfo.isFlipped,
        locationX: chessInfo.locationX,
        locationY: chessInfo.locationY,
        rank: chessInfo.rank,
        alive: chessInfo.alive,
      });

      if (this.chineseChesses.length === TOTAL_CHESS_COUNT) {
        events.emit('game-data-loaded', this.chineseChesses);
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
              this.chineseChesses[idx].isFlipped = value;
              break;
            case ChessInfoChangeList.LocationX:
              this.setChangedChessInfo({
                id: chessInfo.id,
                locationX: value,
              });
              this.chineseChesses[idx].locationX = value;
              break;
            case ChessInfoChangeList.LocationY:
              this.setChangedChessInfo({
                id: chessInfo.id,
                locationY: value,
              });
              this.chineseChesses[idx].locationY = value;
              break;
            case ChessInfoChangeList.Alive:
              this.setChangedChessInfo({
                id: chessInfo.id,
                alive: value,
              });
              this.chineseChesses[idx].alive = value;
              break;
          }
        });
      };
    };
  }
}
