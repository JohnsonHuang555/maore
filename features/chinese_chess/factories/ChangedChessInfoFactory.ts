import { GameMode } from '../models/ChinesChessMode';
import { ChineseChessMessage } from '../models/ChineseChessMessage';
import { ChessInfo } from '../models/ChineseChessState';

type ChessInfoResponse = {
  id?: number;
  targetLocationX?: number;
  targetLocationY?: number;
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
    chineseChesses: ChessInfo[],
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
            const { locationX, locationY } = chineseChesses.find(
              (c) => c.id === chessInfo.id
            ) as ChessInfo;
            this.tempChessInfo = {
              targetLocationX: locationX,
              targetLocationY: locationY,
            };
          } else if (
            this.tempChessInfo?.targetLocationX &&
            this.tempChessInfo?.targetLocationY
          ) {
            return {
              actionType: ChineseChessMessage.EatChess,
              chessInfo: {
                ...chessInfo,
                targetLocationX: this.tempChessInfo.targetLocationX,
                targetLocationY: this.tempChessInfo.targetLocationY,
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
