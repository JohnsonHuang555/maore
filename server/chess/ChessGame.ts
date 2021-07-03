import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { Metadata } from '../../models/Room';
import ChessGameState from './ChessGameState';
import BaseRoom from '../../server/room';
import { ChessMessage } from '../../models/messages/ChessMessage';
import CreateGameCommand from './commands/CreateGameCommand';

const MAX_CLIENTS = 2;
export default class ChessGame extends Room<ChessGameState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option)
    this.maxClients = MAX_CLIENTS;

    this.setMetadata(option);
    this.setState(new ChessGameState());
    this.onMessage(ChessMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand());
    });
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);

    if (this.clients.length === MAX_CLIENTS) {
      this.lock();
    }
  }

  onLeave(client: Client) {
    // update players
    this.baseRoom.onLeave(client);
  }
}
