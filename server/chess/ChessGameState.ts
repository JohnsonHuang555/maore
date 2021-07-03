import { Schema, ArraySchema, type } from '@colyseus/schema';
import { ChessState } from './ChessState';
import RoomState from '../room/state/RoomState';

export interface ChessGame extends Schema {
  chesses: ArraySchema<ChessState>;
}

export default class ChessGameState extends RoomState implements ChessGame {
  @type([ChessState])
  chesses = new ArraySchema<ChessState>();
}
