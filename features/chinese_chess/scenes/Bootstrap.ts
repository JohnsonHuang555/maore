import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { ChessInfo } from '../models/ChineseChessState';

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
    console.log('---handleGameDataLoaded---');
    // 遊戲資料載入完成才起場景
    this.scene.launch('hidden', {
      chineseChesses,
      server: this.server,
      onGameOver: this.handleGameOver,
    });
  }

  private handleGameOver = () => {
    this.scene.stop('hidden');
    this.server.closeGameScreen();
  };
}
