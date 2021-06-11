import { Command } from '@colyseus/command';
import { PlayerState } from '../state/PlayerState';
import type RoomState from '../state/RoomState';

export type Payload = {
  id: string;
  name: string;
  playerIndex: number;
  isMaster: boolean;
};

export default class PlayerJoinedCommand extends Command<RoomState> {
  execute(data: Payload) {
    this.room.state.players.push(new PlayerState(data));
  }
}
