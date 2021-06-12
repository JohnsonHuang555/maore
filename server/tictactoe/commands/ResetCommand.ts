import { Command } from '@colyseus/command';
import { Cell } from '../../../features/tictactoe/models/Cell';
import { GameState } from '../../../models/Room';
import TicTacToeState from '../state/TicTacToeState';

export default class ResetCommand extends Command<TicTacToeState> {
  execute() {
    // reset
    for (let i = 0; i < 9; i++) {
      this.room.state.board[i] = Cell.Empty;
    }
    // FIXME: 抽個 command
    this.state.winningPlayer = -1;
    // TODO: 改隨機
    this.state.activePlayer = 0;
    this.state.gameState = GameState.Playing;
  }
}
