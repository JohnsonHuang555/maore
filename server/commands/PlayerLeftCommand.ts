import { Command } from '@colyseus/command';
import { TicTacToe } from '../tictactoe/TicTacToeState';

type Payload = {
  playerId: string;
};

export default class PlayerLeftCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    const idx = this.room.state.players.findIndex(
      (player) => player.id === data.playerId
    );
    this.room.state.players.splice(idx, 1);
    const hasMaster = this.room.state.players.find((p) => p.isMaster);

    if (!hasMaster) {
      this.room.state.players[0].isMaster = true;
    }

    // 重新指派所有玩家 playerIndex
    for (let i = 0; i < this.room.state.players.length; i++) {
      this.room.state.players[i].playerIndex = i;
    }
  }
}
