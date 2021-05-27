import { Command } from '@colyseus/command';
import { TicTacToe } from '../tictactoe/TicTacToeState';

type Payload = {
  playerId: string;
};

export default class PlayerLeftCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    const itemIndex = this.room.state.players.findIndex(
      (player) => player.id === data.playerId
    );
    this.room.state.players.splice(itemIndex, 1);
  }
}
