import { ChineseChessMessage } from '../models/ChineseChessMessage';
import { ChessInfo } from '../models/ChineseChessState';

type ChessInfoResponse = {
  id?: number;
  targetId?: number;
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
