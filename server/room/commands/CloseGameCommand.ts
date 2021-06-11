import { Command } from '@colyseus/command';
import type RoomState from '../state/RoomState';
import { GameState } from '../../../models/Room';

export default class CloseGameCommand extends Command<RoomState> {
  execute() {
    this.room.state.gameState = GameState.WaitingForPlayers;
  }
}
