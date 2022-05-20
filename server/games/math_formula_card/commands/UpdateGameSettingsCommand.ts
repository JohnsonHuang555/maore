import { Command } from '@colyseus/command';
import { GameStatus } from '../../../../domain/models/Room';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  winnerPoint?: number;
};

export default class UpdateGameSettingsCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { winnerPoint } = data;
    // 只有在等待玩家時可以設定
    if (this.state.gameStatus === GameStatus.Playing) {
      return;
    }
    if (winnerPoint) {
      this.room.state.mathFormulaCard.gameSettings.winnerPoint =
        data.winnerPoint as number;
    }
  }
}
