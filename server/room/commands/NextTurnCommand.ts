import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';

export default class NextTurnCommand extends Command<RoomState> {
  execute() {
    const { activePlayer, players } = this.room.state;
    const playerCount = players.length;
    const nextPlayer = activePlayer + 1;
    if (nextPlayer < playerCount) {
      this.room.state.activePlayer = nextPlayer;
    } else {
      // 回到第一個玩家
      this.room.state.activePlayer = 0;
    }
  }
}
