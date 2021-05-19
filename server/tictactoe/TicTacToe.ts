import { Client, Room as ServerRoom } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { GameState, Metadata } from '../models/Room';
import TicTacToeState from './TicTacToeState';
import { Message } from '../models/Message';
import PlayerSelectionCommand from './commands/PlayerSelectionCommand';

export default class TicTacToe extends ServerRoom<TicTacToeState> {
  private dispatcher = new Dispatcher(this);

  onCreate(option: Metadata) {
    this.setMetadata(option);
    this.maxClients = 2;
    this.setState(new TicTacToeState());
    this.onMessage(
      Message.PlayerSelection,
      (client, message: { index: number }) => {
        this.dispatcher.dispatch(new PlayerSelectionCommand(), {
          client,
          index: message.index,
        });
      }
    );
  }

  onJoin(client: Client) {
    const idx = this.clients.findIndex((c) => c.sessionId === client.sessionId);
    client.send(Message.PlayerIndex, { playerIndex: idx });

    if (this.clients.length >= 2) {
      this.state.gameState = GameState.Playing;
      this.lock();
    }
  }
}
