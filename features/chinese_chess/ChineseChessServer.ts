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

enum MoveOrEat {
  Move = 'move',
  Eat = 'eat',
}

const TOTAL_CHESS_COUNT = 32;
/** 接收與傳送後端事件 */
export default class ChineseChessServer extends BaseServer {
  // 已選擇的棋子
  public selectedChessId?: number;

  // 當更新棋子時，會有值
  public changedChessInfo?: ChangedChessInfo;

  // 投降視窗是否開啟
  public showSurrenderModal: boolean = false;

  // 所有棋子，隨著後端更新
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

  setShowSurrenderModal(show: boolean) {
    this.showSurrenderModal = show;
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
    const { name, locationX, locationY } = this.getChessById(
      this.selectedChessId as number
    );
    const canMove = this.canMoveChess(
      name,
      locationX,
      locationY,
      targetX,
      targetY,
      MoveOrEat.Eat
    );
    if (!canMove) {
      return;
    }
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
      targetY,
      MoveOrEat.Eat
    );
    if (!canMove) {
      return;
    }
    const canEat = this.canEatChess(
      name,
      targetChessName,
      locationX,
      locationY,
      targetX,
      targetY,
      rank,
      targetRank
    );
    if (!canEat) {
      return;
    }
    this.room.send(ChineseChessMessage.EatChess, {
      id: this.selectedChessId,
      targetId,
    });
    this.setSelectedChessId(undefined);
  }

  surrender() {
    this.room.send(ChineseChessMessage.Surrender);
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
    targetY: number,
    moveOrEat: MoveOrEat
  ): boolean {
    switch (this.roomInfo.gameMode) {
      case GameMode.Standard: {
        return false;
      }
      case GameMode.Hidden: {
        if (
          (chessName === ChessNameBlack.Cannon ||
            chessName === ChessNameRed.Cannon) &&
          moveOrEat === MoveOrEat.Eat
        ) {
          return true;
        }
        const range = CheckMoveRange.shortCross(locationX, locationY);
        return CheckMoveRange.isInRange(range, targetX, targetY);
      }
      default: {
        return false;
      }
    }
  }

  private canEatChess(
    chessName: ChessNameBlack | ChessNameRed,
    targetChessName: ChessNameBlack | ChessNameRed,
    locationX: number,
    locationY: number,
    targetX: number,
    targetY: number,
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
          return this.canonEatLogic(locationX, locationY, targetX, targetY);
        }
        // 卒可以吃帥，兵可以吃將
        if (
          (chessName === ChessNameBlack.Soldier &&
            targetChessName === ChessNameRed.King) ||
          (chessName === ChessNameRed.Soldier &&
            targetChessName === ChessNameBlack.King)
        ) {
          return true;
        }
        // 帥不可以吃卒，將不可以吃兵
        if (
          (chessName === ChessNameBlack.King &&
            targetChessName === ChessNameRed.Soldier) ||
          (chessName === ChessNameRed.King &&
            targetChessName === ChessNameBlack.Soldier)
        ) {
          return false;
        }
        // 卒不可以吃砲，兵不可以吃砲
        if (
          (chessName === ChessNameBlack.Soldier &&
            targetChessName === ChessNameRed.Cannon) ||
          (chessName === ChessNameRed.Soldier &&
            targetChessName === ChessNameBlack.Cannon)
        ) {
          return false;
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

  // 砲吃的邏輯
  private canonEatLogic(
    locationX: number,
    locationY: number,
    targetX: number,
    targetY: number
  ): boolean {
    let middleChesses: ChessInfo[] = [];
    if (locationX === targetX) {
      middleChesses = this.chineseChesses.filter((c) => {
        return (
          c.locationX === targetX &&
          c.locationY > Math.min(targetY, locationY) &&
          c.locationY < Math.max(targetY, locationY) &&
          c.alive
        );
      });
    } else if (locationY === targetY) {
      middleChesses = this.chineseChesses.filter((c) => {
        return (
          c.locationY === targetY &&
          c.locationX > Math.min(targetX, locationX) &&
          c.locationX < Math.max(targetX, locationX) &&
          c.alive
        );
      });
    }

    // 只有隔一個則可以吃
    if (middleChesses.length === 1) {
      return true;
    }
    return false;
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
        console.log('game-data-loaded');
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
