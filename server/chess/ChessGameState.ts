import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../types/PlayerState';
import { GameState } from '../../models/Room';
import { RoomInfoState } from '../types/RoomInfoState';
import { ChessState } from './ChessState';

export interface ChessGame extends Schema {
  players: ArraySchema<PlayerState>;
  roomInfo: RoomInfoState;
  chesses: ArraySchema<ChessState>;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}

export default class ChessGameState extends Schema implements ChessGame {
  @type([PlayerState])
  players: ArraySchema<PlayerState>;

  @type(RoomInfoState)
  roomInfo: RoomInfoState;

  @type('number')
  gameState = GameState.WaitingForPlayers;

  @type([ChessState])
  chesses: ArraySchema<ChessState>;

  @type('number')
  activePlayer = 0;

  @type('number')
  winningPlayer = -1;

  constructor() {
    super();
    this.chesses = new ArraySchema<ChessState>();
    this.players = new ArraySchema<PlayerState>();
    this.roomInfo = new RoomInfoState({ roomTitle: '', maxPlayers: 0 });
  }
}
