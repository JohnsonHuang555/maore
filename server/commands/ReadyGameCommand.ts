import { Command } from '@colyseus/command';
import { TicTacToe } from '../tictactoe/TicTacToeState';
import { Client } from 'colyseus';

export type Payload = {
  client: Client;
};

export default class ReadyGameCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    this.room.state.players[clientIndex].isReady = true;
  }
}
