import { Schema, type } from '@colyseus/schema';
import { Payload } from '../commands/PlayerJoinedCommand';

// An abstract player object
export class PlayerState extends Schema {
  @type('string')
  id: string;

  @type('string')
  name: string;

  @type('boolean')
  isMaster: boolean;

  @type('boolean')
  isReady: boolean;

  @type('number')
  playerIndex: number;

  constructor(data: Payload) {
    super();
    const { id, name, isMaster, playerIndex } = data;
    this.id = id;
    this.name = name;
    this.isMaster = isMaster;
    this.playerIndex = playerIndex;
    this.isReady = isMaster ? true : false;
  }
}
