import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';
import { GameStatus } from '../../../models/Room';

export default class CloseGameCommand extends Command<RoomState> {
  execute() {
    this.room.state.gameStatus = GameStatus.WaitingForPlayers;
  }
}
