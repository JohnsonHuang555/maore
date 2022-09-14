import { Schema, ArraySchema, type } from '@colyseus/schema';
import { ChessSide } from '../../../../features/chinese_chess_hidden/models/ChineseChessSide';
import { ChessInfoState } from './ChessInfoState';

export interface IPlayerInfo {
  chessSide: ChessSide | '';
  eatenChesses: ArraySchema<ChessInfoState>;
}

export class PlayerInfoState extends Schema implements IPlayerInfo {
  @type('string')
  chessSide: ChessSide | '';

  @type([ChessInfoState])
  eatenChesses: ArraySchema<ChessInfoState>;

  constructor({ chessSide, eatenChesses }: IPlayerInfo) {
    super();
    this.chessSide = chessSide;
    this.eatenChesses = eatenChesses;
  }
}
