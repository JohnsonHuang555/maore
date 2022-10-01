import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import ChineseChessHidden from '../ChineseChessHidden';

export type Payload = {
  client: Client;
};

export default class SurrenderCommand extends Command<ChineseChessHidden> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id !== client.id);
    this.room.state.winningPlayer = clientIndex;
  }
}
