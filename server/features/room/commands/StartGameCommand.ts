import { Command } from '@colyseus/command';
import { GameStatus } from '../../../../domain/models/Room';
import RoomState from '../state/RoomState';

export default class StartGameCommand extends Command<RoomState> {
  execute() {
    this.state.gameStatus = GameStatus.Playing;
  }
}