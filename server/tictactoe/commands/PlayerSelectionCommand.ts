import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { Cell } from '../../../features/tictactoe/models/Cell';
import { GameState } from '../../../models/Room';
import type TicTacToe from '../state/TicTacToeState';
import CheckWinnerCommand from './CheckWinnerCommand';

type Payload = {
  client: Client;
  index: number;
};

export default class PlayerSelectionCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    const { client, index } = data;

    if (this.room.state.gameState !== GameState.Playing) {
      return;
    }

    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    if (clientIndex !== this.room.state.activePlayer) {
      return;
    }

    const cellValue = clientIndex === 0 ? Cell.X : Cell.O;
    this.room.state.board[index] = cellValue;

    return [new CheckWinnerCommand()];
  }
}
