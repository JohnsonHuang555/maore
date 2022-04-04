import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from './PlayerState';
import { RoomInfoState } from './RoomInfoState';
import { GameStatus } from '../../../../models/Room';

export interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  roomInfo: RoomInfoState;
  gameStatus: GameStatus;
  activePlayer: number;
  winningPlayer: number;
}

export default class RoomState extends Schema implements Room {
  // 當前玩家
  @type([PlayerState])
  players: ArraySchema<PlayerState>;

  // 房間額外資訊
  @type(RoomInfoState)
  roomInfo: RoomInfoState;

  // 房間狀態
  @type('number')
  gameStatus = GameStatus.WaitingForPlayers;

  // 該玩家的回合
  @type('number')
  activePlayer = -1;

  // 勝利玩家
  @type('number')
  winningPlayer = -1;

  constructor() {
    super();
    this.players = new ArraySchema<PlayerState>();
    this.roomInfo = new RoomInfoState();
  }
}
