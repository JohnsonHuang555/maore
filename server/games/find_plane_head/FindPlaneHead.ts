import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../../room';
import { Metadata } from '../../../domain/models/Room';
import { RoomMessage } from '../../../domain/models/Message';
import RoomState from '../../room/state/RoomState';
import CreateGameCommand from './commands/CreateGameCommand';

export default class FindPlaneHead extends Room<RoomState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    // TODO: 未來可以分組
    this.baseRoom.setMaxClient(2);
    this.setState(new RoomState());

    this.onMessage(RoomMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand());
    });

    // 結束遊戲
    this.onMessage(RoomMessage.FinishGame, () => {
      // this.dispatcher.dispatch(new ResetCommand());
    });
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
    // this.dispatcher.dispatch(new ResetCommand());
  }
}
