import { Client } from 'colyseus';
import { Command } from '@colyseus/command';
import ChineseChessHidden from '../ChineseChessHidden';
import { CheckMoveRange } from '../helpers/CheckMoveRange';
import { ChessInfoState } from '../state/ChessInfoState';
import {
  ChessNameRed,
  ChessNameBlack,
} from '../../../../features/chinese_chess_hidden/models/ChineseChessName';
import { ChineseChessMessage } from '../../../../features/chinese_chess_hidden/models/ChineseChessMessage';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';

type Payload = {
  client: Client;
  selectedChessId: string;
  targetId: string;
};

export default class EatChessCommand extends Command<ChineseChessHidden> {
  execute(data: Payload) {
    const { client, selectedChessId, targetId } = data;
    const selectedChessIndex =
      this.room.state.chineseChessHidden.chesses.findIndex(
        (c) => c.id === selectedChessId
      );
    const targetChessIndex =
      this.room.state.chineseChessHidden.chesses.findIndex(
        (c) => c.id === targetId
      );

    const selectedChess =
      this.room.state.chineseChessHidden.chesses[selectedChessIndex];
    const targetChess =
      this.room.state.chineseChessHidden.chesses[targetChessIndex];

    const range = CheckMoveRange.shortCross(
      selectedChess.locationX,
      selectedChess.locationY
    );
    const isInRange = CheckMoveRange.isInRange(
      range,
      targetChess.locationX,
      targetChess.locationY
    );
    if (
      !isInRange &&
      (selectedChess.name === ChessNameBlack.Cannon ||
        selectedChess.name === ChessNameRed.Cannon)
    ) {
      client.send(ChineseChessMessage.ErrorMsg, '超出範圍!!');
      return;
    }

    const canEat = this.checkEatChess(selectedChess, targetChess);
    if (!canEat) {
      client.send(ChineseChessMessage.ErrorMsg, '這個棋子很大，你不能吃它!!');
      return;
    }

    targetChess.alive = false;
    selectedChess.locationX = targetChess.locationX;
    selectedChess.locationY = targetChess.locationY;

    return [new NextTurnCommand()];
  }

  private checkEatChess(
    selectedChess: ChessInfoState,
    targetChess: ChessInfoState
  ) {
    const { rank, name } = selectedChess;
    const { rank: targetRank, name: targetChessName } = targetChess;
    // 炮要另外判斷
    if (name === ChessNameBlack.Cannon || name === ChessNameRed.Cannon) {
      return this.canonEatLogic(selectedChess, targetChess);
    }

    // 卒可以吃帥，兵可以吃將
    if (
      (name === ChessNameBlack.Soldier &&
        targetChessName === ChessNameRed.King) ||
      (name === ChessNameRed.Soldier && targetChessName === ChessNameBlack.King)
    ) {
      return true;
    }
    // 帥不可以吃卒，將不可以吃兵
    if (
      (name === ChessNameBlack.King &&
        targetChessName === ChessNameRed.Soldier) ||
      (name === ChessNameRed.King && targetChessName === ChessNameBlack.Soldier)
    ) {
      return false;
    }
    // 卒不可以吃砲，兵不可以吃砲
    if (
      (name === ChessNameBlack.Soldier &&
        targetChessName === ChessNameRed.Cannon) ||
      (name === ChessNameRed.Soldier &&
        targetChessName === ChessNameBlack.Cannon)
    ) {
      return false;
    }
    if (rank >= targetRank) {
      return true;
    }
    return false;
  }

  // 砲吃的邏輯
  private canonEatLogic(
    selectedChess: ChessInfoState,
    targetChess: ChessInfoState
  ): boolean {
    const { locationX, locationY } = selectedChess;
    const { locationX: targetX, locationY: targetY } = targetChess;
    let middleChesses: ChessInfoState[] = [];
    if (locationX === targetX) {
      middleChesses = this.room.state.chineseChessHidden.chesses.filter((c) => {
        return (
          c.locationX === targetX &&
          c.locationY > Math.min(targetY, locationY) &&
          c.locationY < Math.max(targetY, locationY) &&
          c.alive
        );
      });
    } else if (locationY === targetY) {
      middleChesses = this.room.state.chineseChessHidden.chesses.filter((c) => {
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
}
