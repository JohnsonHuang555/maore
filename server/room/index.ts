import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';
import RoomState from './state/RoomState';
import { Message } from '../../models/messages/RoomMessage';
import { Metadata } from '../../models/Room';
import PlayerLeftCommand from './commands/PlayerLeftCommand';
import ReadyGameCommand from './commands/ReadyGameCommand';
import StartGameCommand from './commands/StartGameCommand';
import CloseGameCommand from './commands/CloseGameCommand';
import PlayerJoinedCommand from './commands/PlayerJoinedCommand';
import UpdateRoomInfoCommand from './commands/UpdateRoomInfoCommand';

export default class BaseRoom {
  private dispatcher;
  private room: Room<RoomState, Metadata>;
  constructor(room: Room<RoomState, Metadata>) {
    this.room = room;
    this.dispatcher = new Dispatcher(room);
  }

  setMaxClient(maxClients: number) {
    this.room.maxClients = maxClients;
  }

  onCreate(option: Metadata) {
    this.room.setMetadata(option);
    this.room.onMessage(Message.ReadyGame, (client) => {
      this.dispatcher.dispatch(new ReadyGameCommand(), {
        client,
      });
    });

    this.room.onMessage(Message.StartGame, () => {
      this.dispatcher.dispatch(new StartGameCommand());
    });

    this.room.onMessage(Message.CloseGame, () => {
      this.dispatcher.dispatch(new CloseGameCommand());
    });
  }

  onJoin(client: Client, option: Metadata) {
    const idx = this.room.clients.findIndex(
      (c) => c.sessionId === client.sessionId
    );

    client.send(Message.YourPlayerId, { yourPlayerId: client.id });

    // update room title
    this.dispatcher.dispatch(new UpdateRoomInfoCommand(), {
      maxPlayers: this.room.maxClients,
      roomTitle: this.room.metadata.roomTitle,
      gamePack: this.room.metadata.gamePack,
      gameMode: this.room.metadata.gameMode,
    });

    const isMaster = this.room.clients.length === 1;
    // update players
    this.dispatcher.dispatch(new PlayerJoinedCommand(), {
      id: client.id,
      name: option.playerName,
      isMaster,
      playerIndex: idx,
    });

    if (this.room.clients.length === this.room.maxClients) {
      this.room.lock();
    }
  }

  onLeave(client: Client) {
    // update players
    this.dispatcher.dispatch(new PlayerLeftCommand(), { playerId: client.id });
    this.room.unlock();
  }
}
