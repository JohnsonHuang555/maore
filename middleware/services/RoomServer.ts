import {
  addPlayer,
  createdRoom,
  setRoomInfo,
  loadedRooms,
  removePlayer,
  setYourPlayerId,
  updateGameStatus,
  setShowGameScreen,
  updateWinningPlayer,
  updateActivePlayer,
  setPlayerInfo,
  setMessage,
} from 'actions/RoomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { GameList } from 'models/Game';
import { RoomMessage } from 'models/Message';
import { GameStatus, Metadata, RoomInfo } from 'models/Room';
import { AnyAction, Dispatch } from 'redux';
import { Schema, ArraySchema } from '@colyseus/schema';
import { PlayerState } from 'server/room/state/PlayerState';
import { setClient, setRoom } from 'actions/ServerAction';
import { TicTacToeState } from 'features/tictactoe/models/TicTacToeState';
import { ChineseChessState } from 'features/chinese_chess/models/ChineseChessState';

enum RoomStateChangeList {
  RoomInfo = 'roomInfo',
  GameStatus = 'gameStatus',
  WinningPlayer = 'winningPlayer',
  ActivePlayer = 'activePlayer',
}

enum PlayerStateChangeList {
  IsReady = 'isReady',
  IsMaster = 'isMaster',
  PlayerIndex = 'playerIndex',
  PlayerOrder = 'playerOrder',
  GameLoaded = 'gameLoaded',
  Group = 'group',
}

export interface Room extends Schema, TicTacToeState, ChineseChessState {
  players: ArraySchema<PlayerState>;
  gameStatus: GameStatus; // 遊戲狀態
  activePlayer: number; // 當前玩家
  winningPlayer: number; // 勝利玩家
  playerIndex: number; // 玩家順序號
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
    room.send(RoomMessage.ReadyGame);
  }

  async startGame(room: ClientRoom<Room>) {
    room.send(RoomMessage.StartGame);
  }

  async sendMessage(room: ClientRoom<Room>, message: string) {
    room.send(RoomMessage.SendMessage, message);
  }

  async updateRoomInfo(room: ClientRoom<Room>, roomInfo: Partial<RoomInfo>) {
    room.send(RoomMessage.UpdateRoomInfo, { roomInfo });
  }

  private handleRoomChange(room: ClientRoom<Room>) {
    room.onMessage(
      RoomMessage.GetYourPlayerId,
      (message: { yourPlayerId: string }) => {
        this.dispatch(setYourPlayerId(message.yourPlayerId));
      }
    );

    room.onMessage(RoomMessage.GetMessages, (message: string) => {
      this.dispatch(setMessage(message));
    });

    // room players changes...
    room.state.players.onAdd = (player) => {
      this.dispatch(addPlayer(player));
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          switch (field) {
            case PlayerStateChangeList.IsReady: {
              this.dispatch(
                setPlayerInfo(player.id, {
                  isReady: value,
                })
              );
              break;
            }
            case PlayerStateChangeList.IsMaster: {
              this.dispatch(
                setPlayerInfo(player.id, {
                  isMaster: value,
                })
              );
              break;
            }
            case PlayerStateChangeList.PlayerIndex: {
              this.dispatch(
                setPlayerInfo(player.id, {
                  playerIndex: value,
                })
              );
              break;
            }
            case PlayerStateChangeList.PlayerOrder: {
              this.dispatch(
                setPlayerInfo(player.id, {
                  playerOrder: value,
                })
              );
              break;
            }
            case PlayerStateChangeList.GameLoaded: {
              this.dispatch(
                setPlayerInfo(player.id, {
                  gameLoaded: value,
                })
              );
              break;
            }
            case PlayerStateChangeList.Group: {
              this.dispatch(
                setPlayerInfo(player.id, {
                  group: value,
                })
              );
              break;
            }
          }
        });
      };
    };

    room.state.players.onRemove = (item) => {
      this.dispatch(removePlayer(item.id));
      this.dispatch(setShowGameScreen(false));
    };

    // room state changes...
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case RoomStateChangeList.RoomInfo: {
            console.log(value);
            this.dispatch(
              setRoomInfo({
                roomTitle: value.roomTitle,
                maxPlayers: value.maxPlayers,
                gamePack: value.gamePack,
                gameMode: value.gameMode,
                extraSettings: value.extraSettings,
              })
            );
            break;
          }
          case RoomStateChangeList.GameStatus: {
            const isPlaying = value === GameStatus.Playing;
            if (isPlaying) {
              this.dispatch(setShowGameScreen(isPlaying));
            }
            this.dispatch(updateGameStatus(value));
            break;
          }
          case RoomStateChangeList.ActivePlayer: {
            this.dispatch(updateActivePlayer(value));
            break;
          }
          case RoomStateChangeList.WinningPlayer: {
            this.dispatch(updateWinningPlayer(value));
            break;
          }
        }
      });
    };
  }
}
