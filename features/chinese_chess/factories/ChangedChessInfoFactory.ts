import { GameMode } from '../models/ChinesChessMode';
import { ChineseChessMessage } from '../models/ChineseChessMessage';
import { ChessInfo } from '../models/ChineseChessState';

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
    chineseChesses: ChessInfo[],
    chessInfo: Partial<ChessInfo>
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
        const { locationX, locationY, id } = chineseChesses.find(
          (c) => c.id === chessInfo.id
        ) as ChessInfo;
        this.tempChessInfo = {
          targetId: id,
          targetLocationX: locationX,
          targetLocationY: locationY,
        };
      } else if (
        this.tempChessInfo?.targetLocationX ||
        this.tempChessInfo?.targetLocationY
      ) {
        return {
          actionType: ChineseChessMessage.EatChess,
          chessInfo: {
            id: chessInfo.id,
            targetId: this.tempChessInfo.targetId,
            targetLocationX: this.tempChessInfo.targetLocationX,
            targetLocationY: this.tempChessInfo.targetLocationY,
          },
        };
      } else {
        // const { locationX, locationY } = chineseChesses.find(
        //   (c) => c.id === chessInfo.id
        // ) as ChessInfo;
        // return {
        //   actionType: ChineseChessMessage.MoveChess,
        //   chessInfo: {
        //     targetLocationX: loc
        //   }
        // };
      }
    }
  }
}
