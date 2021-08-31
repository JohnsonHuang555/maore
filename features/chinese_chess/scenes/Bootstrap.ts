import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { ChessInfo } from '../models/ChineseChessState';
import { GameMode } from '../models/ChinesChessMode';

/** 決定要使用哪個場景 */
export default class Bootstrap extends Phaser.Scene {
  private server!: Server;
  constructor() {
    super('bootstrap');
  }

  init() {
    console.log('init bootstrap');
    this.server = new Server();
    // 初始化 callback 方法
    this.server.onAllPlayersLoaded(this.handleAllPlayersLoaded, this);
    this.server.onGameDataLoaded(this.handleGameDataLoaded, this);
  }

  private handleAllPlayersLoaded(isLoaded: boolean) {
    console.log('get game data', isLoaded);
    this.server.getGameData();
  }

  private handleGameDataLoaded(chineseChesses: ChessInfo[]) {
    const mode = this.server.roomInfo.gameMode;
    console.log('---handleGameDataLoaded---');
    // 遊戲資料載入完成才起場景
    switch (mode) {
      case GameMode.Standard:
        this.scene.launch('standard', {
          chineseChesses,
          server: this.server,
          onGameOver: this.handleGameOver,
        });
        break;
      case GameMode.Hidden:
        this.scene.launch('hidden', {
          chineseChesses,
          server: this.server,
          onGameOver: this.handleGameOver,
        });
        break;
    }
  }

  private handleGameOver = () => {
    this.scene.stop('hidden');
    this.server.closeGameScreen();
  };
}
