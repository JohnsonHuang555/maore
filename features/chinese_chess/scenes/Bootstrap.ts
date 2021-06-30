import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { ChessInfo } from '../models/ChineseChessState';

/** 決定要使用哪個場景 */
export default class Bootstrap extends Phaser.Scene {
  private server!: Server;
  constructor() {
    super('bootstrap');
  }

  init() {
    this.server = new Server();
    // 初始化 callback 方法
    this.server.onAllPlayersLoaded(this.handleAllPlayersLoaded, this);
    this.server.onGameDataLoaded(this.handleGameDataLoaded, this);
  }

  private handleAllPlayersLoaded(isLoaded: boolean) {
    if (isLoaded) {
      this.server.getGameData();
    }
  }

  private handleGameDataLoaded(chineseChesses: ChessInfo[]) {
    // 遊戲資料載入完成才起場景
    this.scene.launch('hidden', {
      chineseChesses,
      server: this.server,
      onGameOver: this.handleGameOver,
    });
  }

  private handleGameOver = (data: GameOverSceneData) => {
    this.scene.stop('hidden');
    this.server.finishGame();
    this.scene.launch('game-over', {
      ...data,
      onClose: this.handleClose,
    });
  };

  private handleClose = () => {
    this.scene.stop('game-over');
    this.server.closeGameScreen();
  };
}
