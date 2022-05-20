import { Command } from '@colyseus/command';
import { GameStatus } from '../../../domain/models/Room';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';

type Payload = {
  playerId: string;
};

export default class PlayerLeftCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute(data: Payload) {
    const idx = this.room.state.players.findIndex(
      (player) => player.id === data.playerId
    );
    this.room.state.players.splice(idx, 1);

    // 如果房間剩下一人就切狀態
    if (this.room.state.players.length === 1) {
      this.state.gameStatus = GameStatus.WaitingForPlayers;
    }

    // 房間沒人
    if (!this.room.state.players.length) {
      return;
    }

    const hasMaster = this.room.state.players.find((p) => p.isMaster);

    if (!hasMaster) {
      this.room.state.players[0].isMaster = true;
      this.room.state.players[0].isReady = true;
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
