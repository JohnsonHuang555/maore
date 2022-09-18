import { Command } from '@colyseus/command';
import { PlayerState } from '../state/PlayerState';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';

export type Payload = {
  id: string;
  name: string;
  playerIndex: number;
  isMaster: boolean;
  photoURL: string;
};

export default class PlayerJoinedCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute(data: Payload) {
    this.room.state.players.push(new PlayerState(data));
  }
}
