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
  updateGameStatus,
} from 'actions/RoomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { GameList } from 'models/Game';
import { Message } from 'models/Message';
import { GameState, Metadata } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';
import { Schema, ArraySchema } from '@colyseus/schema';
import { PlayerState } from 'server/room/state/PlayerState';
import { setClient, setRoom } from 'actions/ServerAction';
import { Cell } from 'features/tictactoe/models/Cell';

export interface Room extends Schema {
  players: ArraySchema<PlayerState>;
  gameState: GameState; // 遊戲狀態
  activePlayer: number; // 當前玩家
  winningPlayer: number; // 勝利玩家
  playerIndex: number; // 玩家順序號

  // FIXME: Refactor 現在都混在一起不好維護
  // games data
  // tictactoe
  board: ArraySchema<Cell>;
}

export default class RoomServer {
  private dispatch: Dispatch<AnyAction>;

  constructor(dispatch: Dispatch<AnyAction>) {
    const client = new Client('ws://localhost:3000');
    dispatch(setClient(client));
    this.dispatch = dispatch;
  }

  async getAllRooms(client: Client, gamePack: GameList) {
    const rooms = await client.getAvailableRooms(gamePack);
    this.dispatch(loadedRooms(rooms));
  }

  // 房主觸發 createOrJoinRoom 只會觸發一次
  async createRoom(client: Client, gamePack: GameList, metaData: Metadata) {
    const room = await client.create<Room>(gamePack, metaData);
    this.dispatch(createdRoom(room.id));
    this.dispatch(setRoom(room));
    this.handleRoomChange(room);
  }

  // 加入房間玩家觸發
  async joinRoom(client: Client, roomId: string, metaData: Metadata) {
    const room = await client.joinById<Room>(roomId, metaData);
    this.dispatch(setRoom(room));
    this.handleRoomChange(room);
  }

  async leaveRoom(room: ClientRoom<Room>) {
    room.leave();
    room.removeAllListeners();
  }

  async readyGame(room: ClientRoom<Room>) {
    room.send(Message.ReadyGame);
  }

  async startGame(room: ClientRoom<Room>) {
    room.send(Message.StartGame);
  }

  private handleRoomChange(room: ClientRoom<Room>) {
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
      console.log('roomserver changed');
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
          case 'gameState': {
            this.dispatch(updateGameStatus(value));
          }
        }
      });
    };
  }
}
