import { Schema, type } from '@colyseus/schema';
import { GamePack } from 'server/domain/Game';

// An abstract roomInfo object
export class RoomInfoState extends Schema {
  @type('string')
  roomTitle: string = '';

  @type('number')
  maxPlayers: number = 0;

  @type('string')
  gamePack: GamePack | string = '';
}
