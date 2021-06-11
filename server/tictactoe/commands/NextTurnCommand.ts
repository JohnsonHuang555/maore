import { Command } from '@colyseus/command';
import type TicTacToe from '../state/TicTacToeState';

export default class NextTurnCommand extends Command<TicTacToe> {
  execute() {
    const activePlayer = this.room.state.activePlayer;
    if (activePlayer === 0) {
      this.room.state.activePlayer = 1;
    } else {
      this.room.state.activePlayer = 0;
    }
  }
}
