import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { GameStatus, RoomInfo } from '@models/Room';
import { RoomMessage } from '@models/Message';
import { Player } from '@models/Player';
import { setSnackbar } from '@actions/AppAction';
import { setShowGameScreen } from '@actions/RoomAction';
import { sharedInstance as events } from 'features/base/EventCenter';
import ComponentService from 'features/base/services/ComponentService';

/** 共用接收與傳送房間資料，監聽 store state */
export default class BaseServer {
  public room: ClientRoom<Room>;
  public components: ComponentService;
  private _gameStatus: GameStatus;
  private _roomInfo: RoomInfo;
  private _isGameOver: boolean = false;
  private tempIsAllPlayersLoaded: boolean = false;
  private tempActivePlayer: number = -1;
  private unsubscribe: () => void;

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
    // if (this.playerInfo.playerIndex !== this.room.state.activePlayer) {
    //   this.showAlert('不是你的回合！');
    //   return false;
    // }
    return this.playerInfo.playerIndex === this.room.state.activePlayer;
  }

  get allPlayers() {
    const { room } = store.getState();
    return room.players;
  }

  get isGameOver() {
    return this._isGameOver;
  }

  constructor() {
    console.log('Init BaseServer');
    const { server, room } = store.getState();
    if (!server.room) {
      throw new Error('room not found...');
    }
    this._gameStatus = room.gameStatus;
    this._roomInfo = room.roomInfo;
    this.room = server.room;
    this.components = new ComponentService();
    // 監聽 state 的變化
    this.unsubscribe = store.subscribe(this.handleRoomStateChange);
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
    this.room.send(RoomMessage.CreatePlayerOrder);
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
        isAllPlayersLoaded,
        players,
        gameStatus,
      },
    } = store.getState();
    if (gameStatus === GameStatus.WaitingForPlayers) {
      this.components.destroy();
      events.removeAllListeners();
      // 停止 state 監聽
      this.unsubscribe();
      return;
    }

    const hasGroupPlayerCount = players.filter((p) => p.group).length;
    if (hasGroupPlayerCount !== 0) {
      console.log('has group player count', hasGroupPlayerCount);
      events.emit('player-group-changed', hasGroupPlayerCount);
    }
    // 此方法會重複觸發必須存到變數以避免送出多次
    if (isAllPlayersLoaded && !this.tempIsAllPlayersLoaded) {
      this.tempIsAllPlayersLoaded = true;
      console.log('is all players loaded', isAllPlayersLoaded);
      events.emit('is-all-players-loaded', isAllPlayersLoaded);
    }

    // FIXME: 這是只有在一位玩家贏了的情境，之後還要再改
    if (winningPlayer !== -1) {
      this._isGameOver = true;
      if (this.playerInfo.isMaster) {
        this.finishGame();
      }
      console.log('winning player', winningPlayer);
      events.emit('player-win', winningPlayer);
    }

    if (this.tempActivePlayer !== activePlayer) {
      this.tempActivePlayer = activePlayer;
      console.log('active player', activePlayer);
      events.emit('player-turn-changed', activePlayer);
    }
  };
}
