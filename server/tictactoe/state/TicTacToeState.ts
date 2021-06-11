import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../../room/state/PlayerState';
import { GameState } from '../../../models/Room';
import { RoomInfoState } from '../../room/state/RoomInfoState';
import { Cell } from '../../../features/tictactoe/models/Cell';
import RoomState from '../../room/state/RoomState';

export interface TicTacToe extends Schema {
  board: ArraySchema<Cell>;
}

export default class TicTacToeState
  extends Schema
  implements TicTacToe, RoomState
{
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
