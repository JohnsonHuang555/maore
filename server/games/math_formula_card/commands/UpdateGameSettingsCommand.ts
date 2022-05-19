import { Command } from '@colyseus/command';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  winnerPoint: number;
};

export default class UpdateGameSettingsCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    console.log(data.winnerPoint);
    this.room.state.mathFormulaCard.gameSettings.winnerPoint = data.winnerPoint;
  }
}
