import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { GameStatus, RoomInfo } from 'models/Room';
import { RoomMessage } from 'models/Message';
import { Player } from 'models/Player';
import { setSnackbar } from 'actions/AppAction';
import { setShowGameScreen } from 'actions/RoomAction';
import { sharedInstance as events } from 'features/base/EventCenter';
import ComponentService from 'features/base/services/ComponentService';

/** 共用接收與傳送房間資料，監聽 store state */
export default class BaseServer {
  public room: ClientRoom<Room>;
  public components: ComponentService;
  private _gameStatus: GameStatus;
  private _roomInfo: RoomInfo;

  // 遊戲狀態
  get gameStatus() {
    return this._gameStatus;
  }

  get playerInfo() {
    const { room } = store.getState();
    const playerInfo = room.players.find((p) => p.id === room.yourPlayerId);
    return playerInfo as Player;
  }

  get roomInfo() {
    return this._roomInfo;
  }

  get isYourTurn() {
    if (this.playerInfo.playerIndex !== this.room.state.activePlayer) {
      this.showAlert('不是你的回合！');
      return false;
    }
    return true;
  }

  get allPlayers() {
    const { room } = store.getState();
    return room.players;
  }

  constructor() {
    const { server, room } = store.getState();
    if (!server.room) {
      throw new Error('room not found...');
    }
    this._gameStatus = room.gameStatus;
    this._roomInfo = room.roomInfo;
    this.room = server.room;
    this.components = new ComponentService();
    // 監聽 state 的變化
    store.subscribe(this.handleRoomStateChange);
    // 打給後端 phaser 環境載入完成
    this.loadedGame();
  }

  // change redux state
  showAlert(message: string) {
    store.dispatch(
      setSnackbar({
        show: true,
        message,
      })
    );
  }

  closeGameScreen() {
    store.dispatch(setShowGameScreen(false));
  }

  // events
  loadedGame() {
    this.room.send(RoomMessage.LoadedGame);
  }

  createPlayerOrder() {
    this.room.send(RoomMessage.CreatePlyayerOrder);
  }

  finishGame() {
    this.room.send(RoomMessage.FinishGame);
  }

  // handles
  onAllPlayersLoaded(cb: (isLoaded: boolean) => void, context?: any) {
    events.on('is-all-players-loaded', cb, context);
  }

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    events.on('player-turn-changed', cb, context);
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    events.on('player-win', cb, context);
  }

  onPlayerGroupChanged(cb: (count: number) => void, context?: any) {
    events.on('player-group-changed', cb, context);
  }

  private handleRoomStateChange = () => {
    const {
      room: {
        winningPlayer,
        activePlayer,
        gameStatus,
        isAllPlayersLoaded,
        players,
      },
    } = store.getState();
    if (gameStatus === GameStatus.WaitingForPlayers) {
      this.components.destroy();
      events.removeAllListeners();
    }
    const hasGroupPlayerCount = players.filter((p) => p.group).length;
    events.emit('player-group-changed', hasGroupPlayerCount);
    events.emit('is-all-players-loaded', isAllPlayersLoaded);
    events.emit('player-win', winningPlayer);
    events.emit('player-turn-changed', activePlayer);
  };
}
