import { Command } from '@colyseus/command';
import ResetGameCommand from '../../base/commands/ResetGameCommand';
import MathFormulaCardState from '../state/MathFormulaCardState';

export default class ResetCommand extends Command<MathFormulaCardState> {
  execute() {
    // reset
    return [new ResetGameCommand()];
  }
}