import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../types/PlayerState';
import { GameState } from '../../models/Room';
import { RoomInfoState } from '../types/RoomInfoState';
import { Cell } from '../../features/tictactoe/models/Cell';

export interface TicTacToe extends Schema {
  players: ArraySchema<PlayerState>;
  roomInfo: RoomInfoState;
  board: ArraySchema<Cell>;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
}

export default class TicTacToeState extends Schema implements TicTacToe {
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
