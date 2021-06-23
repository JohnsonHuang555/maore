import { Command } from '@colyseus/command';
import Random from '../../utils/Random';
import RoomState from '../state/RoomState';

export default class CreatePlayerOrderCommand extends Command<RoomState> {
  execute() {
    const playerCount = this.state.players.length;
    console.log(playerCount, 'playerCount');

    const playOrders = Random.getShuffleNumbers(0, playerCount - 1);
    console.log(playOrders, 'playOrders');
    // for (let i = 0; i < playerCount; i++) {
    //   console.log('update', this.state.players[i]);
    //   this.state.players[i].playerOrder = playOrders[i];
    // }
    // 起始玩家為第一順位
    this.state.activePlayer = this.state.players[0].playerIndex;
  }
}
