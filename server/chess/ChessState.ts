import { Schema, type } from '@colyseus/schema';
import { Side, ChessName } from '../../features/chess/model/Chess';

export type Payload = {
  id: number;
  x: number;
  y: number;
  side: Side;
  name: string;
};

export class ChessState extends Schema {
  @type('number')
  id: number;

  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('string')
  name: string;

  constructor(data: Payload) {
    super();
    const { id, x, y, name } = data;
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
  }
}
