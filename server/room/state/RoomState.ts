import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from './PlayerState';
import { RoomInfoState } from './RoomInfoState';
import { GameStatus } from '../../../models/Room';

export interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  roomInfo: RoomInfoState;
  gameStatus: GameStatus;
  activePlayer: number;
  winningPlayer: number;
}

export default class RoomState extends Schema implements Room {
  @type([PlayerState])
  players: ArraySchema<PlayerState>;

  @type(RoomInfoState)
  roomInfo: RoomInfoState;

  @type('number')
  gameStatus = GameStatus.WaitingForPlayers;

  @type('number')
  activePlayer = 0;

  @type('number')
  winningPlayer = -1;

  constructor() {
    super();
    this.players = new ArraySchema<PlayerState>();
    this.roomInfo = new RoomInfoState({
      roomTitle: '',
      maxPlayers: 0,
      gamePack: '',
    });
  }
}
