import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import RoomState from '../state/RoomState';

export type Payload = {
  client: Client;
};

export default class ReadyGameCommand extends Command<RoomState> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    const isReady = this.room.state.players[clientIndex].isReady;
    this.room.state.players[clientIndex].isReady = !isReady;
  }
}
