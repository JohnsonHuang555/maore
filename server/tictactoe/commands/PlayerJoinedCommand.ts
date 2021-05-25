import { Command } from '@colyseus/command';
import { PlayerState } from '../../types/PlayerState';
import { TicTacToe } from '../TicTacToeState';

export type Payload = {
  id: string;
  name: string;
  playerIndex: number;
  isMaster: boolean;
};

export default class PlayerJoinedCommand extends Command<TicTacToe> {
  execute(data: Payload) {
    this.room.state.players.push(new PlayerState(data));
  }
}
