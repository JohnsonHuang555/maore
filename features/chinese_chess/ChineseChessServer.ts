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

  eatChess(targetId: number) {
    this.room.send(ChineseChessMessage.EatChess, {
      id: this.selectedChessId,
      targetId,
    });
    this.setSelectedChessId(undefined);
  }

  onGameDataLoaded(cb: (chineseChesses: ChessInfo[]) => void, context?: any) {
    events.on('game-data-loaded', cb, context);
  }

  private handleStateChange() {
    this.room.state.chineseChesses.onAdd = (chessInfo) => {
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
