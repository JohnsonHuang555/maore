import { Command } from '@colyseus/command';
import ResetGameCommand from '../../base/commands/ResetGameCommand';
import MathFormulaCardState from '../state/MathFormulaCardState';
import { MapSchema } from '@colyseus/schema';
import { PlayerInfoState } from '../state/PlayerInfoState';

export default class ResetCommand extends Command<MathFormulaCardState> {
  execute() {
    // reset
    this.room.state.playerInfos = new MapSchema<PlayerInfoState>();
    return [new ResetGameCommand()];
  }
}
