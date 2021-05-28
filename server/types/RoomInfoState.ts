import { Schema, type } from '@colyseus/schema';
import { Payload } from '../commands/UpdateRoomInfoCommand';

// An abstract roomInfo object
export class RoomInfoState extends Schema {
  @type('string')
  roomTitle: string;

  @type('number')
  maxPlayers: number;

  constructor(data: Payload) {
    super();
    const { roomTitle, maxPlayers } = data;
    this.roomTitle = roomTitle || '';
    this.maxPlayers = maxPlayers || 0;
  }
}
