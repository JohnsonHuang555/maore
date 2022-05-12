import { Command } from '@colyseus/command';
import ResetGameCommand from '../../../room/commands/ResetGameCommand';
import { MapSchema } from '@colyseus/schema';
import { PlayerInfoState } from '../state/PlayerInfoState';
import RoomState from '../../../room/state/RoomState';
import MathFormulaCard from '../MathFormulaCard';

export default class ResetCommand extends Command<MathFormulaCard> {
  execute() {
    // reset
    this.room.state.mathFormulaCard.playerInfos =
      new MapSchema<PlayerInfoState>();
    return [new ResetGameCommand()];
  }
}
