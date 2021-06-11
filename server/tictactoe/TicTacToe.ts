import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { Metadata } from '../../models/Room';
import TicTacToeState from './state/TicTacToeState';
import { Message } from '../../models/Message';
import PlayerSelectionCommand from './commands/PlayerSelectionCommand';
import ResetCommand from './commands/ResetCommand';
import BaseRoom from '../../server/room';
import RoomState from '../room/state/RoomState';

export default class TicTacToe extends Room<TicTacToeState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    this.maxClients = 2;

    const a = new TicTacToeState();
    const r = new RoomState();

    // this.setMetadata(option);
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

    this.onMessage(Message.PlayAgain, () => {
      this.dispatcher.dispatch(new ResetCommand());
    });
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);

    if (this.clients.length === 2) {
      this.lock();
    }
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
  }
}
