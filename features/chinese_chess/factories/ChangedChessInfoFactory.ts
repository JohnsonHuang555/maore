import { GameMode } from '../models/ChinesChessMode';
import { ChineseChessMessage } from '../models/ChineseChessMessage';
import { ChessInfo } from '../models/ChineseChessState';

type ChessInfoResponse = {
  id?: number;
  targetId?: number;
  locationX?: number;
  locationY?: number;
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
    mode: GameMode
  ): ChangedChessInfo | undefined {
    if (!chessInfo.id) {
      throw new Error('chess id not found...');
    }
    switch (mode) {
      case GameMode.Standard: {
        break;
      }
      case GameMode.Hidden: {
        // 只更新一種的可以直接return
        if (chessInfo.isFlipped) {
          return {
            actionType: ChineseChessMessage.FlipChess,
            chessInfo: { id: chessInfo.id },
          };
        } else {
          if (chessInfo.alive !== undefined) {
            this.tempChessInfo = {
              targetId: chessInfo.id,
            };
            return;
          } else if (
            this.tempChessInfo?.targetId &&
            (chessInfo.locationX || chessInfo.locationY)
          ) {
            return {
              actionType: ChineseChessMessage.EatChess,
              chessInfo: {
                ...chessInfo,
                targetId: this.tempChessInfo.targetId,
              },
            };
          } else {
            return {
              actionType: ChineseChessMessage.MoveChess,
              chessInfo,
            };
          }
        }
      }
    }
  }
}
