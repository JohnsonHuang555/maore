import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { GameStatus, RoomInfo } from 'models/Room';
import { RoomMessage } from 'models/messages/RoomMessage';
import { Player } from 'models/Player';
import { setSnackbar } from 'actions/AppAction';
import { setShowGameScreen } from 'actions/RoomAction';

/** 共用接收與傳送房間資料，監聽 store state */
export default class BaseServer {
  public room: ClientRoom<Room>;
  public events = new Phaser.Events.EventEmitter();
  private _playerInfo: Player;
  private _gameStatus: GameStatus;
  private _roomInfo: RoomInfo;

  get playerIndex() {
    return this._playerInfo;
  }

  // 遊戲狀態
  get gameStatus() {
    return this._gameStatus;
  }

  get playerInfo() {
    return this._playerInfo;
  }

  get roomInfo() {
    return this._roomInfo;
  }

  constructor() {
    const { server, room } = store.getState();
    if (!server.room) {
      throw new Error('room not found...');
    }
    const playerInfo = room.players.find((p) => p.id === room.yourPlayerId);
    if (!playerInfo) {
      throw new Error('player not found...');
    }
    this._playerInfo = playerInfo;
    this._gameStatus = room.gameStatus;
    this._roomInfo = room.roomInfo;
    this.room = server.room;
    // 監聽 state 的變化
    store.subscribe(this.handleRoomStateChange);
    // 打給後端 phaser 環境載入完成
    this.loadedGame();
  }

  showAlert(message: string) {
    store.dispatch(
      setSnackbar({
        show: true,
        message,
      })
    );
  }

  loadedGame() {
    this.room.send(RoomMessage.LoadedGame);
  }

  createPlayerOrder() {
    this.room.send(RoomMessage.CreatePlyayerOrder);
  }

  finishGame() {
    this.room.send(RoomMessage.FinishGame);
  }

  closeGameScreen() {
    store.dispatch(setShowGameScreen(false));
  }

  onAllPlayersLoaded(cb: (isLoaded: boolean) => void, context?: any) {
    this.events.on('is-all-players-loaded', cb, context);
  }

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-turn-changed', cb, context);
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-win', cb, context);
  }

  private handleRoomStateChange = () => {
    const {
      room: { winningPlayer, activePlayer, gameStatus, isAllPlayersLoaded },
    } = store.getState();
    if (gameStatus === GameStatus.WaitingForPlayers) {
      this.events.destroy();
    }
    this.events.emit('is-all-players-loaded', isAllPlayersLoaded);
    this.events.emit('player-win', winningPlayer);
    this.events.emit('player-turn-changed', activePlayer);
  };
}
