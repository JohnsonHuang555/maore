import {
  addPlayer,
  createdRoom,
  setRoomInfo,
  loadedRooms,
  removePlayer,
  setYourPlayerId,
} from 'actions/RoomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { GameList } from 'models/Game';
import { Message } from 'models/Message';
import { Metadata, Room } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';

export default class RoomServer {
  private client: Client;
  private dispatch: Dispatch<AnyAction>;

  private room?: ClientRoom<Room>;
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
    this.room = await this.client.create<Room>(gamePack, metaData);
    this.dispatch(createdRoom(this.room.id));
    this.handleRoomChange();
  }

  // 加入房間玩家觸發
  async joinRoom(roomId: string, metaData: Metadata) {
    this.room = await this.client.joinById<Room>(roomId, metaData);
    this.handleRoomChange();
  }

  async leaveRoom() {
    this.room?.leave();
    this.room?.removeAllListeners();
  }

  async readyGame() {
    if (!this.room) {
      throw new Error('something wrong... QQ');
    }
    this.room?.send(Message.ReadyGame);
  }

  private handleRoomChange() {
    if (!this.room) {
      throw new Error('something wrong... QQ');
    }
    this.room.onMessage(
      Message.YourPlayerId,
      (message: { yourPlayerId: string }) => {
        this.dispatch(setYourPlayerId(message.yourPlayerId));
      }
    );

    this.room.state.players.onAdd = (player) => {
      this.dispatch(addPlayer(player));
      player.onChange = (item) => {
        console.log(item);
      };
    };

    this.room.state.players.onRemove = (item) => {
      this.dispatch(removePlayer(item.id));
    };

    this.room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case 'roomInfo': {
            this.dispatch(
              setRoomInfo({
                roomTilte: value.roomTitle,
                maxPlayers: value.maxPlayers,
              })
            );
            break;
          }
        }
      });
    };
  }
}
