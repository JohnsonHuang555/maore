import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../base';
import { Metadata } from '../../../domain/models/Room';
import MathFormulaCardState from './state/MathFormulaCardState';
import ResetCommand from './commands/ResetCommand';
import { RoomMessage } from '../../../domain/models/Message';
import CreateGameCommand from './commands/CreateGameCommand';

export default class MathFormulaCard extends Room<
  MathFormulaCardState,
  Metadata
> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    // 最多四人
    this.baseRoom.setMaxClient(4);
    this.setState(new MathFormulaCardState());

    this.onMessage(RoomMessage.CreateGame, (client) => {
      this.dispatcher.dispatch(new CreateGameCommand(), { client });
    });
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
    this.dispatcher.dispatch(new ResetCommand());
  }
}
