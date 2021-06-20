import { Schema, type } from '@colyseus/schema';
import { Side } from 'features/chess/model/Chess';
import { ChessInfo } from '../../features/chess/model/ChessState';

export type Payload = ChessInfo;

export class ChessState extends Schema implements ChessInfo {
  @type('number')
  id: number;

  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('string')
  name: string;

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
