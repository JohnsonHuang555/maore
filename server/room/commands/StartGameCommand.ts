import { Command } from '@colyseus/command';
import { GameStatus } from '../../../models/Room';
import RoomState from '../state/RoomState';

export default class StartGameCommand extends Command<RoomState> {
  execute() {
    // 隨機寫入起始玩家

    this.state.gameStatus = GameStatus.Playing;
  }
}
