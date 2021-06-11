import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from './PlayerState';
import { RoomInfoState } from './RoomInfoState';
import { GameState } from '../../models/Room';

export interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  roomInfo: RoomInfoState;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}

export default class RoomState extends Schema implements Room {
  @type([PlayerState])
  players: ArraySchema<PlayerState>;

  @type(RoomInfoState)
  roomInfo: RoomInfoState;

  @type('number')
  gameState = GameState.WaitingForPlayers;

  @type(['number'])
  board: ArraySchema<number>;

  @type('number')
  activePlayer = 0;

  @type('number')
  winningPlayer = -1;

  constructor() {
    super();
    this.board = new ArraySchema(0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.players = new ArraySchema<PlayerState>();
    this.roomInfo = new RoomInfoState({ roomTitle: '', maxPlayers: 0 });
  }
}
