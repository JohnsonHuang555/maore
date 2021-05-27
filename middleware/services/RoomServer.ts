import {
  addPlayer,
  createdRoom,
  initialRoom,
  loadedRooms,
  updatePlayerIndex,
} from 'actions/RoomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { GameList } from 'models/Game';
import { Message } from 'models/Message';
import { Player } from 'models/Player';
import { Metadata, Room } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';

export default class RoomServer {
  private client: Client;
  private dispatch: Dispatch<AnyAction>;

  constructor(dispatch: Dispatch<AnyAction>) {
    this.client = new Client('ws://localhost:3000');
    this.dispatch = dispatch;
  }

  async getAllRooms(gamePack: GameList) {
    const rooms = await this.client.getAvailableRooms(gamePack);
    this.dispatch(loadedRooms(rooms));
  }

  // 房主觸發 createOrJoinRoom 只會觸發一次
  async createRoom(gamePack: GameList, metaData: Metadata) {
    const room = await this.client.create<Room>(gamePack, metaData);
    this.dispatch(createdRoom(room.id));
    this.handleRoomChange(room);
  }

  // 加入房間玩家觸發
  async joinRoom(roomId: string, metaData: Metadata) {
    const room = await this.client.joinById<Room>(roomId, metaData);
    this.handleRoomChange(room);
  }

  private handleRoomChange(room: ClientRoom<Room>) {
    room.onMessage(Message.PlayerIndex, (message: { playerIndex: number }) => {
      this.dispatch(updatePlayerIndex(message.playerIndex));
    });

    room.state.players.onAdd = (item) => {
      this.dispatch(addPlayer(item));
    };
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          // initial room
          case 'roomTitle': {
            this.dispatch(
              initialRoom({
                roomTitle: value,
              })
            );
            break;
          }
        }
      });
    };
  }
}
