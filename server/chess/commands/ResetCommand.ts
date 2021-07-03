import { ArraySchema } from '@colyseus/schema';
import { Command } from '@colyseus/command';
import ResetGameCommand from '../../room/commands/ResetGameCommand';
import { ChessState } from '../ChessState';
import ChessGameState from '../ChessGameState';

export default class ResetCommand extends Command<ChessGameState> {
  execute() {
    // reset
    this.room.state.chesses = new ArraySchema<ChessState>();
    return [new ResetGameCommand()];
  }
}
