import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';

type Payload = {
  allGroups: string[];
  needSetGroup: string;
  playerId: string;
};

const NO_VALUE = '';
export default class UpdatePlayerGroupCommand extends Command<RoomState> {
  execute(data: Payload) {
    const { allGroups, playerId, needSetGroup } = data;
    // 判斷有無未分配組別的玩家
    const hasUngroupPlayer = this.room.state.players.find(
      (player) => player.group === NO_VALUE
    );
    if (!hasUngroupPlayer) {
      return;
    }

    const clientIndex = this.room.clients.findIndex((c) => c.id === playerId);
    this.room.state.players[clientIndex].group = needSetGroup;
    // 移除新加的，剩下是未加的
    let groups = allGroups.filter((group) => group !== needSetGroup);
    // 假如剩下一個要組別要分配到最後一個玩家上
    if (groups.length === 1) {
      // 取得未分配的玩家
      const lastUngroupPlayerIndex = this.room.state.players.findIndex(
        (player) => player.group === NO_VALUE
      );
      this.room.state.players[lastUngroupPlayerIndex].group = groups[0];
    }
  }
}
