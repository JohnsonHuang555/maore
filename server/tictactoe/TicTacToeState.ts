import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../../models/Player';
import { GameState } from '../../models/Room';
import { TicTacToe } from '../../models/tic_tac_toe/TicTacToe';

export default class TicTacToeState extends Schema implements TicTacToe {
  @type([PlayerState])
  players = new ArraySchema<PlayerState>();

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
  }
}
