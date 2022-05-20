import { Command } from '@colyseus/command';
import { GameStatus } from '../../../domain/models/Room';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';

export default class StartGameCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute() {
    this.state.gameStatus = GameStatus.Playing;
  }
}
