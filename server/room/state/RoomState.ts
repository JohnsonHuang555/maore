import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from './PlayerState';
import { RoomInfoState } from './RoomInfoState';
import { GameStatus } from '../../../domain/models/Room';
import MathFormulaCardState from '../../games/math_formula_card/state/MathFormulaCardState';
import ChineseChessState from '../../games/chinese_chess/state/ChineseChessState';

export interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  roomInfo: RoomInfoState;
  gameStatus: GameStatus;
  activePlayer: number;
  winningPlayer: number;
  // 各個遊戲的 mapSchema
  chineseChess: ChineseChessState;
  mathFormulaCard: MathFormulaCardState;
}

export default class RoomState extends Schema implements Room {
  // 當前玩家
  @type([PlayerState])
  players: ArraySchema<PlayerState> = new ArraySchema<PlayerState>();

  // 房間額外資訊
  @type(RoomInfoState)
  roomInfo: RoomInfoState = new RoomInfoState();

  // 房間狀態
  @type('number')
  gameStatus = GameStatus.WaitingForPlayers;

  // 該玩家的回合
  @type('number')
  activePlayer = -1;

  // 勝利玩家
  @type('number')
  winningPlayer = -1;

  // 數學牌
  @type(ChineseChessState)
  chineseChess = new ChineseChessState();

  // 數學牌
  @type(MathFormulaCardState)
  mathFormulaCard = new MathFormulaCardState();
}
