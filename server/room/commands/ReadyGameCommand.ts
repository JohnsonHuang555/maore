import { Command } from '@colyseus/command';
import { Client, Room } from 'colyseus';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';

export type Payload = {
  client: Client;
};

export default class ReadyGameCommand extends Command<
  Room<RoomState, Metadata>,
  Payload
> {
  execute(data: Payload) {
    const { client } = data;
    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    const isReady = this.room.state.players[clientIndex].isReady;
    this.room.state.players[clientIndex].isReady = !isReady;
  }
}
