import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../types/PlayerState';
import { GameState } from '../../models/Room';

export enum Cell {
  Empty,
  X,
  O,
}

export interface TicTacToe extends Schema {
  players: ArraySchema<PlayerState>;
  roomTitle: string;
  board: ArraySchema<Cell>;
  gameState: GameState;
  activePlayer: number;
  winningPlayer: number;
  playerIndex: number;
}

export default class TicTacToeState extends Schema implements TicTacToe {
  @type([PlayerState])
  players = new ArraySchema<PlayerState>();

  @type('string')
  roomTitle = '';

  @type('number')
  gameState = GameState.WaitingForPlayers;

  @type(['number'])
  board: ArraySchema<number>;

  @type('number')
  activePlayer = 0;

  @type('number')
  winningPlayer = -1;

  // 玩家順序號
  @type('number')
  playerIndex = -1;

  constructor() {
    super();
    this.board = new ArraySchema(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
