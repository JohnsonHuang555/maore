import { Command } from '@colyseus/command';
import { GameState } from '../../../models/Room';
import type RoomState from '../state/RoomState';

export default class StartGameCommand extends Command<RoomState> {
  execute() {
    this.state.gameState = GameState.Playing;
  }
}
