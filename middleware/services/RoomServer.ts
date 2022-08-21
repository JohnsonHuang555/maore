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
} from '@actions/roomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { RoomMessage } from '@domain/models/Message';
import { GameStatus, Metadata, RoomInfo } from '@domain/models/Room';
import { AnyAction, Dispatch } from 'redux';
import { setClient, setRoom } from '@actions/serverAction';
import { Room } from 'server/room/state/RoomState';
import { updateGameSettings as updateMathFormulaSettings } from '@actions/game_settings/mathFormulaAction';
import { GameList } from 'server/domain/Game';
import { setLoading, setShowBaseModal } from '@actions/appAction';
import { ModalType } from 'reducers/appReducer';

enum RoomStateChangeList {
  RoomInfo = 'roomInfo',
  GameStatus = 'gameStatus',
  WinningPlayer = 'winningPlayer',
  ActivePlayer = 'activePlayer',
  MathFormulaCard = 'mathFormulaCard',
}

export default class RoomServer {
  private dispatch: Dispatch<AnyAction>;

  private photoURL?: string;

  constructor(dispatch: Dispatch<AnyAction>) {
    const client = new Client();
    dispatch(setClient(client));
    this.dispatch = dispatch;
  }

  async getAllRooms(client: Client, gamePack: GameList) {
    const rooms = await client.getAvailableRooms(gamePack);
    this.dispatch(loadedRooms(rooms));
    this.dispatch(setLoading(false));
  }

  // 房主觸發 createOrJoinRoom 只會觸發一次
  async createRoom(
    client: Client,
    gamePack: GameList,
    photoURL: string,
    metaData: Metadata
  ) {
    this.photoURL = photoURL;
    const room = await client.create<Room>(gamePack, metaData);
    this.dispatch(createdRoom(room.id));
    this.dispatch(setRoom(room));
    this.handleRoomChange(room);
  }

  // 加入房間玩家觸發
  async joinRoom(
    client: Client,
    roomId: string,
    photoURL: string,
    metaData: Metadata
  ) {
    this.photoURL = photoURL;
    try {
      const room = await client.joinById<Room>(roomId, metaData);
      this.dispatch(setRoom(room));
      this.handleRoomChange(room);
    } catch (_e) {
      this.dispatch(
        setShowBaseModal({
          modalType: ModalType.Error,
          message: '房間已經被關閉或是不存在',
          show: true,
        })
      );
    }
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
      // 為了做頭像
      this.dispatch(
        addPlayer({ ...player, photoURL: this.photoURL as string })
      );
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          this.dispatch(
            setPlayerInfo(player.id, {
              [field]: value,
            })
          );
        });
      };
    };

    room.state.players.onRemove = (player) => {
      this.dispatch(removePlayer(player.id));
      this.dispatch(setShowGameScreen(false));
    };

    // room state changes...
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case RoomStateChangeList.RoomInfo: {
            this.dispatch(
              setRoomInfo({
                roomTitle: value.roomTitle,
                maxPlayers: value.maxPlayers,
                gamePack: value.gamePack,
                gameMode: value.gameMode,
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
          case RoomStateChangeList.MathFormulaCard: {
            room.state.mathFormulaCard.gameSettings.onChange = (changes) => {
              changes.forEach((c) => {
                const { field, value } = c;
                this.dispatch(updateMathFormulaSettings({ [field]: value }));
              });
            };
            break;
          }
        }
      });
    };
  }
}
