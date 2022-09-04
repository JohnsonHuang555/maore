import { Schema, type } from '@colyseus/schema';
import {
  ChessNameBlack,
  ChessNameRed,
} from '@features/chinese_chess_hidden/models/ChineseChessName';
import { ChessSide } from '@features/chinese_chess_hidden/models/ChineseChessSide';

export interface IChessInfo {
  id: number;
  chessSide: ChessSide;
  name: ChessNameBlack | ChessNameRed;
  isFlipped: boolean;
  locationX: number;
  locationY: number;
  rank: number;
  alive: boolean;
}

export class ChessInfoState extends Schema implements IChessInfo {
  @type('number')
  id: number;

  @type('string')
  chessSide: ChessSide;

  @type('string')
  name: ChessNameBlack | ChessNameRed;

  @type('boolean')
  isFlipped: boolean;

  @type('number')
  locationX: number;

  @type('number')
  locationY: number;

  @type('number')
  rank: number;

  @type('boolean')
  alive: boolean;

  constructor({
    id,
    chessSide,
    name,
    isFlipped,
    locationX,
    locationY,
    rank,
    alive,
  }: IChessInfo) {
    super();
    this.id = id;
    this.chessSide = chessSide;
    this.name = name;
    this.isFlipped = isFlipped;
    this.locationX = locationX;
    this.locationY = locationY;
    this.rank = rank;
    this.alive = alive;
  }
}
