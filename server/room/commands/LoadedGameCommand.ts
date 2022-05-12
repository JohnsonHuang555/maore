import { Client, Room } from 'colyseus';
import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';

type Payload = {
  client: Client;
};

export default class LoadedGameCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    this.room.state.players[clientIndex].gameLoaded = true;
  }
}
