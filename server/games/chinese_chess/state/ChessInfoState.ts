import { Schema, type } from '@colyseus/schema';
import { ChessInfo } from '../../../../features/chinese_chess/models/ChineseChessState';
import {
  ChessNameBlack,
  ChessNameRed,
} from '../../../../features/chinese_chess/models/ChineseChessName';
import { ChessSide } from '../../../../features/chinese_chess/models/ChineseChessSide';

export class ChessInfoState extends Schema implements ChessInfo {
  @type('number')
  id: number;

  @type('string')
  chessSide: ChessSide;

  @type('string')
  name: ChessNameBlack | ChessNameRed;

  @type('boolean')
  isFlipped?: boolean;

  @type('number')
  locationX: number;

  @type('number')
  locationY: number;

  @type('number')
  rank?: number;

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
  }: ChessInfo) {
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
