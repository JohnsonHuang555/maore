import { Schema, type } from '@colyseus/schema';

export enum CellStatus {
  Empty = 0, // 該格為空
  PlaneHead = 1, // 該格為機頭
  PlaneBody = 2, // 該格為機身
}

export interface IBoardCell {
  x: number;
  y: number;
  status: CellStatus;
}

export default class BoardCellState extends Schema implements IBoardCell {
  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('number')
  status: CellStatus;

  constructor({ x, y, status }: IBoardCell) {
    super();
    this.x = x;
    this.y = y;
    this.status = status;
  }
}
