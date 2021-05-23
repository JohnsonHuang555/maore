import { Command } from '@colyseus/command';
import { TicTacToe } from '../../../models/tic_tac_toe/TicTacToe';
import { Client } from 'colyseus';

type Payload = {
  client: Client;
  index: number;
};

export default class PlayerJoinedCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    const { client } = data;
    const players = this.room.state.players;
    // players.push({ })
  }
}
