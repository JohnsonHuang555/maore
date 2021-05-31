import {
  addPlayer,
  createdRoom,
  setRoomInfo,
  loadedRooms,
  removePlayer,
  setYourPlayerId,
  setPlayerReady,
  setPlayerMaster,
  setPlayerIndex,
} from 'actions/RoomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { GameList } from 'models/Game';
import { Message } from 'models/Message';
import { GameState, Metadata } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';
import { Schema, ArraySchema } from '@colyseus/schema';
import { PlayerState } from 'server/types/PlayerState';

interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  gameState: GameState; // 遊戲狀態
  activePlayer: number; // 當前玩家
  winningPlayer: number; // 勝利玩家
  playerIndex: number; // 玩家順序號
}

let room: ClientRoom<Room>;
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
    room = await this.client.create<Room>(gamePack, metaData);
    this.dispatch(createdRoom(room.id));
    this.handleRoomChange();
  }

  // 加入房間玩家觸發
  async joinRoom(roomId: string, metaData: Metadata) {
    room = await this.client.joinById<Room>(roomId, metaData);
    this.handleRoomChange();
  }

  async leaveRoom() {
    console.log('leave rooooom');
    console.log(room);
    room?.leave();
    room?.removeAllListeners();
  }

  async readyGame() {
    if (!room) {
      throw new Error('something wrong... QQ');
    }
    room?.send(Message.ReadyGame);
  }

  private handleRoomChange() {
    if (!room) {
      throw new Error('something wrong... QQ');
    }
    room.onMessage(
      Message.YourPlayerId,
      (message: { yourPlayerId: string }) => {
        this.dispatch(setYourPlayerId(message.yourPlayerId));
      }
    );

    // room players changes...
    room.state.players.onAdd = (player) => {
      this.dispatch(addPlayer(player));
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          switch (field) {
            case 'isReady': {
              this.dispatch(setPlayerReady(player.id, value));
              break;
            }
            case 'isMaster': {
              this.dispatch(setPlayerMaster(player.id, value));
              break;
            }
            case 'playerIndex': {
              this.dispatch(setPlayerIndex(player.id, value));
            }
          }
        });
      };
    };

    room.state.players.onRemove = (item) => {
      this.dispatch(removePlayer(item.id));
    };

    // room state changes...
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case 'roomInfo': {
            this.dispatch(
              setRoomInfo({
                roomTilte: value.roomTitle,
                maxPlayers: value.maxPlayers,
                gamePack: value.gamePack,
              })
            );
            break;
          }
        }
      });
    };
  }
}
