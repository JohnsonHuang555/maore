import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { GameState, Metadata } from '../../models/Room';
import TicTacToeState from './TicTacToeState';
import { Message } from '../../models/Message';
import PlayerSelectionCommand from './commands/PlayerSelectionCommand';
import PlayerJoinedCommand from '../commands/PlayerJoinedCommand';
import UpdateRoomTitleCommand from '../commands/UpdateRoomTitleCommand';

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
  }

  onJoin(client: Client, option: Metadata) {
    const idx = this.clients.findIndex((c) => c.sessionId === client.sessionId);

    client.send(Message.PlayerIndex, { playerIndex: idx });

    // update room title
    this.dispatcher.dispatch(new UpdateRoomTitleCommand(), {
      roomTitle: this.metadata.roomTitle,
    });

    // update players
    this.dispatcher.dispatch(new PlayerJoinedCommand(), {
      id: client.id,
      name: option.playerName,
      isMaster: true,
      playerIndex: idx,
    });

    // if (this.clients.length >= 2) {
    //   this.state.gameState = GameState.Playing;
    //   this.lock();
    // }
  }
}
