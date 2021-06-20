import { Schema, type } from '@colyseus/schema';
import { GameList } from 'models/Game';
import { Payload } from '../commands/UpdateRoomInfoCommand';

// An abstract roomInfo object
export class RoomInfoState extends Schema {
  @type('string')
  roomTitle: string;

  @type('number')
  maxPlayers: number;

  @type('string')
  gamePack: GameList | string;

  @type('string')
  gameMode?: string;

  constructor(data: Payload) {
    super();
    const { roomTitle, maxPlayers, gamePack, gameMode } = data;
    this.roomTitle = roomTitle;
    this.maxPlayers = maxPlayers;
    this.gamePack = gamePack;
    this.gameMode = gameMode;
  }
}
