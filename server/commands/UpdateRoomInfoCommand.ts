import { Command } from '@colyseus/command';
import { TicTacToe } from '../tictactoe/TicTacToeState';

export type Payload = {
  maxPlayers?: number;
  roomTitle?: string;
};

export default class UpdateRoomInfoCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    // TODO: Refactor ??
    const { maxPlayers, roomTitle } = data;
    if (roomTitle) {
      this.room.state.roomInfo.roomTitle = roomTitle;
    }
    if (maxPlayers) {
      this.room.state.roomInfo.maxPlayers = maxPlayers;
    }
  }
}
