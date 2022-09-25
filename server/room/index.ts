import { Dispatcher } from '@colyseus/command';
import { Client, Room, Delayed } from 'colyseus';
import RoomState from './state/RoomState';
import { RoomMessage } from '../../domain/models/Message';
import { Metadata, RoomInfo } from '../../domain/models/Room';
import PlayerLeftCommand from './commands/PlayerLeftCommand';
import ReadyGameCommand from './commands/ReadyGameCommand';
import StartGameCommand from './commands/StartGameCommand';
import PlayerJoinedCommand from './commands/PlayerJoinedCommand';
import UpdateRoomInfoCommand from './commands/UpdateRoomInfoCommand';
import CreatePlayerOrderCommand from './commands/CreatePlayerOrderCommand';
import LoadedGameCommand from './commands/LoadedGameCommand';

export default class BaseRoom {
  private dispatcher: Dispatcher<Room<RoomState, Metadata>>;
  private room: Room<RoomState, Metadata>;
  public delayedInterval?: Delayed;
  public countDown: number = 5;

  constructor(room: Room<RoomState, Metadata>) {
    this.room = room;
    this.dispatcher = new Dispatcher(room);
  }

  setMaxClient(maxClients: number) {
    this.room.maxClients = maxClients;
  }

  onCreate(option: Metadata) {
    this.room.setMetadata(option);
    this.room.onMessage(RoomMessage.ReadyGame, (client) => {
      if (this.room.clients.length !== this.room.maxClients) {
        // 房間解除鎖定
        this.room.unlock();
      }

      this.delayedInterval?.clear();
      this.room.clock.stop();
      this.room.clock.clear();
      this.countDown = 5;

      this.dispatcher.dispatch(new ReadyGameCommand(), {
        client,
      });
    });

    this.room.onMessage(RoomMessage.StartGame, () => {
      // 房間鎖定，搜到不此房間
      this.room.lock();

      this.room.clock.start();
      this.delayedInterval = this.room.clock.setInterval(() => {
        this.room.broadcast(
          RoomMessage.GetMessages,
          `遊戲開始倒數: ${this.countDown}`
        );
        this.countDown--;
      }, 1000);

      this.room.clock.setTimeout(() => {
        this.dispatcher.dispatch(new StartGameCommand());
        this.countDown = 5;
        this.delayedInterval?.clear();
      }, 6000);
    });

    this.room.onMessage(RoomMessage.CreatePlayerOrder, () => {
      this.dispatcher.dispatch(new CreatePlayerOrderCommand());
    });

    this.room.onMessage(RoomMessage.LoadedGame, (client) => {
      this.dispatcher.dispatch(new LoadedGameCommand(), {
        client,
      });
    });

    this.room.onMessage(RoomMessage.SendMessage, (client, message) => {
      const clientIndex = this.room.clients.findIndex(
        (c) => c.id === client.id
      );
      const name = this.room.state.players[clientIndex].name;
      this.room.broadcast(RoomMessage.GetMessages, `${name}: ${message}`);
    });

    this.room.onMessage(
      RoomMessage.UpdateRoomInfo,
      (_c, message: { roomInfo: Partial<RoomInfo> }) => {
        // TODO: 編輯房間資訊
      }
    );
  }

  onJoin(client: Client, option: Metadata) {
    const idx = this.room.clients.findIndex(
      (c) => c.sessionId === client.sessionId
    );

    client.send(RoomMessage.GetYourPlayerId, { yourPlayerId: client.id });

    // update room title
    this.dispatcher.dispatch(new UpdateRoomInfoCommand(), {
      maxPlayers: this.room.maxClients,
      roomTitle: this.room.metadata.roomTitle,
      gamePack: this.room.metadata.gamePack,
    });

    const isMaster = this.room.clients.length === 1;
    // update players
    this.dispatcher.dispatch(new PlayerJoinedCommand(), {
      id: client.id,
      name: option.playerName,
      photoURL: option.photoURL,
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
