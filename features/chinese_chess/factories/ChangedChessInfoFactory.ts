import { ChessNameBlack, ChessNameRed } from '../@models/ChineseChessName';
import { ChineseChessMessage } from '../@models/ChineseChessMessage';
import { ChessInfo } from '../@models/ChineseChessState';

type ChessInfoResponse = {
  id?: number;
  targetId?: number;
  targetLocationX?: number;
  targetLocationY?: number;
};

export type ChangedChessInfo = {
  actionType: ChineseChessMessage;
  chessInfo: ChessInfoResponse;
};

export default class ChangedChessInfoFactory {
  // 暫存因為更新不會打整包
  static tempChessInfo?: ChessInfoResponse;

  static clearTempChessInfo() {
    this.tempChessInfo = undefined;
  }

  static getChangedChessInfo(
    chessInfo: Partial<ChessInfo>,
    chineseChesses: ChessInfo[],
    isHiddenMode: boolean
  ): ChangedChessInfo | undefined {
    if (!chessInfo.id) {
      throw new Error('chess id not found...');
    }
    // 只更新一種的可以直接return
    if (chessInfo.isFlipped) {
      return {
        actionType: ChineseChessMessage.FlipChess,
        chessInfo: { id: chessInfo.id },
      };
    } else {
      if (chessInfo.alive !== undefined && !chessInfo.alive) {
        this.tempChessInfo = {
          targetId: chessInfo.id,
        };
      } else if (this.tempChessInfo?.targetId) {
        return {
          actionType: ChineseChessMessage.EatChess,
          chessInfo: {
            id: chessInfo.id,
            targetId: this.tempChessInfo.targetId,
          },
        };
      } else if (
        chessInfo.locationX !== undefined ||
        chessInfo.locationY !== undefined
      ) {
        const chessName = chineseChesses.find(
          (c) => c.id === chessInfo.id
        )?.name;
        if (!chessName) {
          throw new Error('Chess not found');
        }
        const onlyLocationXorLocationY = [
          ChessNameBlack.Cannon,
          ChessNameRed.Cannon,
          ChessNameBlack.King,
          ChessNameRed.King,
          ChessNameBlack.Chariot,
          ChessNameRed.Chariot,
          ChessNameBlack.Soldier,
          ChessNameRed.Soldier,
        ];

        // 所有只有走直線的情境，還有暗棋
        if (isHiddenMode || onlyLocationXorLocationY.includes(chessName)) {
          return {
            actionType: ChineseChessMessage.MoveChess,
            chessInfo: {
              id: chessInfo.id,
              targetLocationX: chessInfo.locationX,
              targetLocationY: chessInfo.locationY,
            },
          };
        }
        // locationX 跟 locationY 都會有的情境
        const targetLocationX = this.tempChessInfo?.targetLocationX
          ? this.tempChessInfo?.targetLocationX
          : chessInfo.locationX;
        const targetLocationY = this.tempChessInfo?.targetLocationY
          ? this.tempChessInfo?.targetLocationY
          : chessInfo.locationY;

        return {
          actionType: ChineseChessMessage.MoveChess,
          chessInfo: {
            id: chessInfo.id,
            targetLocationX,
            targetLocationY,
          },
        };
      }
    }
  }
}
