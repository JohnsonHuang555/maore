import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import ChineseChess from '../ChineseChess';

export type Payload = {
  client: Client;
};

export default class SurrenderCommand extends Command<ChineseChess> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id !== client.id);
    this.room.state.winningPlayer = clientIndex;
  }
}
