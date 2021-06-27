import { Schema, type } from '@colyseus/schema';
import { Chess, Side, ChessName } from 'features/chess/model/Chess';

export type Payload = Chess;

export class ChessState extends Schema implements Chess {
  @type('number')
  id: number;

  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('string')
  name: ChessName;

  @type('string')
  side: Side;

  constructor(data: Payload) {
    super();
    const { id, x, y, name, side } = data;
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.side = side;
  }
}
