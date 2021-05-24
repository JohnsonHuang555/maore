import { loadedCurrentRoom, loadedRooms } from 'actions/RoomAction';
import { Client } from 'colyseus.js';
import { GameList } from 'models/Game';
import { Metadata, Room } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';

export default class Server {
  private client: Client;
  private dispatch: Dispatch<AnyAction>;

  constructor(dispatch: Dispatch<AnyAction>) {
    this.client = new Client('ws://localhost:3000');
    this.dispatch = dispatch;
  }

  async joinLobby() {
    const lobby = await this.client.joinOrCreate('lobby');
    lobby.onMessage('rooms', (rooms) => {
      this.dispatch(loadedRooms(rooms));
    });
  }

  async createRoom(gamePack: GameList, metaData: Metadata) {
    const room = await this.client.create<Room>(gamePack, metaData);
    this.dispatch(loadedCurrentRoom(room));
  }

  async joinRoom(roomId: string) {
    const room = await this.client.joinById<Room>(roomId);
    console.log(room, 'room');
    this.dispatch(loadedCurrentRoom(room));
  }
}
