import { Command } from '@colyseus/command';
import Random from '../../utils/Random';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';

const FIRST_PLAYER_ORDER = 0;
export default class CreatePlayerOrderCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute() {
    const playerCount = this.state.players.length;
    const playOrders = Random.getShuffleNumbers(0, playerCount - 1);
    let firstPlayerIndex = -1;
    for (let i = 0; i < playerCount; i++) {
      this.state.players[i].playerOrder = playOrders[i];
      this.state.players[i].isPlaying = true;
      if (playOrders[i] === FIRST_PLAYER_ORDER) {
        firstPlayerIndex = this.state.players[i].playerIndex;
      }
    }
    // 起始玩家為第一順位
    this.state.activePlayer = firstPlayerIndex;
  }
}
