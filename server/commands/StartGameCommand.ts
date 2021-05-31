import { Command } from '@colyseus/command';
import { GameState } from '../../models/Room';
import { TicTacToe } from '../tictactoe/TicTacToeState';

export default class StartGameCommand extends Command<TicTacToe> {
  execute() {
    this.state.gameState = GameState.Playing;
  }
}
