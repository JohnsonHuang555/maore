import { Command } from '@colyseus/command';
import Random from '../../utils/Random';
import RoomState from '../state/RoomState';

export default class CreatePlayerOrderCommand extends Command<RoomState> {
  execute() {
    const playerCount = this.state.players.length;
    const playOrders = Random.getShuffleNumbers(0, playerCount - 1);
    for (let i = 0; i < playerCount; i++) {
      this.state.players[i].playerOrder = playOrders[i];
    }
  }
}
