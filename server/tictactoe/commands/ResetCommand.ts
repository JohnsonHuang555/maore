import { Command } from '@colyseus/command';
import { TicTacToe } from '../TicTacToeState';
import { Cell } from '../../../features/tictactoe/models/Cell';
import { GameState } from '../../../models/Room';

export default class ResetCommand extends Command<TicTacToe> {
  execute() {
    // reset
    this.state.winningPlayer = -1;
    for (let i = 0; i < 9; i++) {
      this.room.state.board[i] = Cell.Empty;
    }
    // TODO: 改隨機
    this.state.activePlayer = 0;
    this.state.gameState = GameState.Playing;
  }
}
