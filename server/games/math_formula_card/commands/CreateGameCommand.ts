import { Command } from '@colyseus/command';
import Random from '../../../utils/Random';
import MathFormulaCardState from '../state/MathFormulaCardState';

export default class CreateGameCommand extends Command<MathFormulaCardState> {
  execute() {
    const answer = Random.getRangeNumbers(0, 100, 1);
    this.room.state.answer = answer[0];
  }
}
