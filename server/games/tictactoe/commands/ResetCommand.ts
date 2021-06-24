import { Command } from '@colyseus/command';
import { Cell } from '../../../../features/tictactoe/models/Cell';
import TicTacToeState from '../state/TicTacToeState';
import ResetGameCommand from '../../../room/commands/ResetGameCommand';

export default class ResetCommand extends Command<TicTacToeState> {
  execute() {
    // reset
    for (let i = 0; i < 9; i++) {
      this.room.state.board[i] = Cell.Empty;
    }
    return [new ResetGameCommand()];
  }
}
