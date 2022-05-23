import { ArraySchema } from '@colyseus/schema';
import { Command } from '@colyseus/command';
import ResetGameCommand from '../../../room/commands/ResetGameCommand';
import { ChessInfoState } from '../state/ChessInfoState';
import ChineseChess from '../ChineseChess';

export default class ResetCommand extends Command<ChineseChess> {
  execute() {
    // reset
    this.room.state.chineseChess.chineseChesses =
      new ArraySchema<ChessInfoState>();
    return [new ResetGameCommand()];
  }
}
