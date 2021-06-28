import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { GameStatus } from '../../../../models/Room';
import ChineseChessState from '../state/ChineseChessState';

type Payload = {
  client: Client;
  id: number;
};

export default class FlipChessCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { client, id } = data;

    if (this.state.gameStatus !== GameStatus.Playing) {
      return;
    }

    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    if (clientIndex !== this.room.state.activePlayer) {
      return;
    }

    const chessIndex = this.room.state.chineseChesses.findIndex(
      (c) => c.id === id
    );

    this.room.state.chineseChesses[chessIndex].isFlipped = true;
  }
}
