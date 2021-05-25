import { Command } from '@colyseus/command';
import { TicTacToe } from '../TicTacToeState';

type Payload = {
  roomTitle: string;
};

export default class UpdateRoomTitleCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    const { roomTitle } = data;
    this.state.roomTitle = roomTitle;
  }
}
