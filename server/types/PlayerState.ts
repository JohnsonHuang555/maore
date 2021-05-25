import { Schema, type } from '@colyseus/schema';
import { Payload } from '../commands/PlayerJoinedCommand';

// An abstract player object, demonstrating a potential 2D world position
export class PlayerState extends Schema {
  @type('string')
  id: string = '';

  @type('string')
  name: string = '';

  @type('boolean')
  isMaster: boolean = false;

  @type('boolean')
  isReady: boolean = false;

  @type('number')
  playerIndex: number = -1;

  constructor(data: Payload) {
    super();
    const { id, name, isMaster, playerIndex } = data;
    this.id = id;
    this.name = name;
    this.isMaster = isMaster;
    this.playerIndex = playerIndex;
    this.isReady = false;
  }
}
