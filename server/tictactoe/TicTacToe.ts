import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { Metadata } from '../../models/Room';
import TicTacToeState from './TicTacToeState';
import { Message } from '../../models/Message';
import PlayerSelectionCommand from './commands/PlayerSelectionCommand';
import PlayerJoinedCommand from '../commands/PlayerJoinedCommand';
import UpdateRoomInfoCommand from '../commands/UpdateRoomInfoCommand';
import PlayerLeftCommand from '../commands/PlayerLeftCommand';
import ReadyGameCommand from '../commands/ReadyGameCommand';

export default class TicTacToe extends Room<TicTacToeState, Metadata> {
  private dispatcher = new Dispatcher(this);

  onCreate(option: Metadata) {
    this.maxClients = 2;

    this.setMetadata(option);
    this.setState(new TicTacToeState());

    // 監聽前端的選擇事件
    this.onMessage(
      Message.PlayerSelection,
      (client, message: { index: number }) => {
        this.dispatcher.dispatch(new PlayerSelectionCommand(), {
          client,
          index: message.index,
        });
      }
    );

    this.onMessage(Message.ReadyGame, (client) => {
      this.dispatcher.dispatch(new ReadyGameCommand(), {
        client,
      });
    });
  }

  onJoin(client: Client, option: Metadata) {
    const idx = this.clients.findIndex((c) => c.sessionId === client.sessionId);

    client.send(Message.YourPlayerId, { yourPlayerId: client.id });

    // update room title
    this.dispatcher.dispatch(new UpdateRoomInfoCommand(), {
      maxPlayers: this.maxClients,
      roomTitle: this.metadata.roomTitle,
    });

    const isMaster = this.clients.length === 1;
    // update players
    this.dispatcher.dispatch(new PlayerJoinedCommand(), {
      id: client.id,
      name: option.playerName,
      isMaster,
      playerIndex: idx,
    });

    if (this.clients.length === 2) {
      this.lock();
    }
  }

  onLeave(client: Client) {
    // update players
    this.dispatcher.dispatch(new PlayerLeftCommand(), { playerId: client.id });
    this.unlock();
  }
}
