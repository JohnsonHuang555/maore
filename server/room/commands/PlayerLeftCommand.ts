import { Command } from '@colyseus/command';
import { GameStatus } from '../../../models/Room';
import RoomState from '../state/RoomState';

type Payload = {
  playerId: string;
};

export default class PlayerLeftCommand extends Command<RoomState> {
  execute(data: Payload) {
    const idx = this.room.state.players.findIndex(
      (player) => player.id === data.playerId
    );
    this.room.state.players.splice(idx, 1);
    this.state.gameStatus = GameStatus.WaitingForPlayers;

    // 房間沒人
    if (!this.room.state.players.length) {
      return;
    }

    const hasMaster = this.room.state.players.find((p) => p.isMaster);

    if (!hasMaster) {
      this.room.state.players[0].isMaster = true;
    }

    // 重新指派所有玩家 成員
    for (let i = 0; i < this.room.state.players.length; i++) {
      this.room.state.players[i].playerIndex = i;
      this.room.state.players[i].playerOrder = -1;
      this.room.state.players[i].gameLoaded = false;
      this.room.state.players[i].group = '';
    }
  }
}
