import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import RoomState from '../../../room/state/RoomState';

export type Payload = {
  client: Client;
};

export default class SurrenderCommand extends Command<RoomState> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id !== client.id);
    this.room.state.winningPlayer = clientIndex;
  }
}
