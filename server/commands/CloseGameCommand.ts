import { Command } from '@colyseus/command';
import { TicTacToe } from '../tictactoe/TicTacToeState';
import { GameState } from '../../models/Room';

export default class CloseGameCommand extends Command<TicTacToe> {
  execute() {
    this.room.state.gameState = GameState.WaitingForPlayers;
  }
}
