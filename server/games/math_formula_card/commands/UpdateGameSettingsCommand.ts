import { Command } from '@colyseus/command';
import { GameStatus } from '../../../../domain/models/Room';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  winnerPoint?: number;
  remainedSecond?: number;
};

export default class UpdateGameSettingsCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { winnerPoint, remainedSecond } = data;
    // 只有在等待玩家時可以設定
    if (this.state.gameStatus === GameStatus.Playing) {
      return;
    }
    if (winnerPoint) {
      this.room.state.mathFormulaCard.gameSettings.winnerPoint =
        winnerPoint as number;
    }

    if (remainedSecond) {
      this.room.state.mathFormulaCard.gameSettings.remainedSecond =
        remainedSecond as number;
    }
  }
}
