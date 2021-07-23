import { Schema, type } from '@colyseus/schema';
import { GameList } from '../../../models/Game';

// An abstract roomInfo object
export class RoomInfoState extends Schema {
  @type('string')
  roomTitle: string = '';

  @type('number')
  maxPlayers: number = 0;

  @type('string')
  gamePack: GameList | string = '';

  @type('string')
  gameMode?: string;

  @type('string')
  extraSetting?: string;
}
