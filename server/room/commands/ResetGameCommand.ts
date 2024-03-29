import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';
import { GameStatus } from '../../../domain/models/Room';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';

export default class ResetGameCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute() {
    const playerCount = this.state.players.length;
    for (let i = 0; i < playerCount; i++) {
      this.state.players[i].playerOrder = -1;
      this.state.players[i].isPlaying = false;
      this.state.players[i].gameLoaded = false;
      this.state.players[i].group = '';
      // 除了房主其餘玩家接重設準備狀態
      if (!this.state.players[i].isMaster) {
        this.state.players[i].isReady = false;
      }
    }

    // 重設贏家
    this.state.winningPlayer = -1;
    // 重設該回合玩家
    this.state.activePlayer = -1;
    // 重設房間狀態
    this.state.gameStatus = GameStatus.WaitingForPlayers;
  }
}
