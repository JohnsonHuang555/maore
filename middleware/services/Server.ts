import { loadedRoom } from 'actions/RoomAction';
import { Client, Room as ClientRoom, RoomAvailable } from 'colyseus.js';
import { GameList } from 'models/Game';
import { Metadata, Room } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';

export default class Server {
  private client: Client;
  private dispatch: Dispatch<AnyAction>;

  private lobby?: ClientRoom;
  private room?: ClientRoom<Room>;
  constructor(dispatch: Dispatch<AnyAction>) {
    this.client = new Client('ws://localhost:3000');
    this.dispatch = dispatch;
  }

  async joinLobby() {
    this.lobby = await this.client.joinOrCreate('lobby');
    this.lobby.onMessage('rooms', (rooms) => {
      this.dispatch(loadedRoom(rooms));
    });
  }
}
