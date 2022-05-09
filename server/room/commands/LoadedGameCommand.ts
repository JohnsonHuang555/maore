import { Client } from 'colyseus';
import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';

type Payload = {
  client: Client;
};

export default class LoadedGameCommand extends Command<RoomState> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    this.room.state.players[clientIndex].gameLoaded = true;
  }
}
