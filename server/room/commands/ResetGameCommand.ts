import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';
import { GameStatus } from '../../../models/Room';

export default class CloseGameCommand extends Command<RoomState> {
  execute() {
    // for (let i = 0; i < array.length; i++) {
    //   const element = array[i];

    // }
    this.room.state.gameStatus = GameStatus.WaitingForPlayers;
  }
}
