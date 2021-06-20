import { Schema, type } from '@colyseus/schema';
import { Side, ChessRowName, ChessColumnName } from '../../features/chess/model/Chess';

export type Payload = {
  id: number;
  x: ChessColumnName;
  y: ChessRowName;
  side: Side;
  name: string;
};

export class ChessState extends Schema {
  @type('number')
  id: number;

  @type('number')
  x: ChessColumnName;

  @type('number')
  y: ChessRowName;

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
