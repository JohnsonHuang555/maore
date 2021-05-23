import { Schema, type } from '@colyseus/schema';

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
}
