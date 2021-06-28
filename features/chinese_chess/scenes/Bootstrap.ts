import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';

// 決定要使用哪個場景
export default class Bootstrap extends Phaser.Scene {
  private server!: Server;
  constructor() {
    super('bootstrap');
  }

  init() {
    this.server = new Server();
    this.server.onAllPlayersLoaded(this.handleAllPlayersLoaded, this);
  }

  create() {
    this.createNewGame();
  }

  private handleAllPlayersLoaded(isLoaded: boolean) {
    if (isLoaded) {
      console.log(isLoaded, 'all players loaded');
      this.server.getGameData();
    }
  }

  private createNewGame = () => {
    // 在開始遊戲時，決定遊玩順序，由房主決定
    if (this.server.playerInfo.isMaster) {
      this.server.createPlayerOrder();
    }
    this.scene.launch('hidden', {
      server: this.server,
      onGameOver: this.handleGameOver,
    });
  };

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
