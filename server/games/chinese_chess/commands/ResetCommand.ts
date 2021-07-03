import { ArraySchema } from '@colyseus/schema';
import { Command } from '@colyseus/command';
import ChineseChessState from '../state/ChineseChessState';
import ResetGameCommand from '../../../room/commands/ResetGameCommand';
import { ChessInfoState } from '../state/ChessInfoState';

export default class ResetCommand extends Command<ChineseChessState> {
  execute() {
    // reset
    this.room.state.chineseChesses = new ArraySchema<ChessInfoState>();
    return [new ResetGameCommand()];
  }
}
