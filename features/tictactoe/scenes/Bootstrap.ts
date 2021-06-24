import Phaser from 'phaser';
import Server from 'features/tictactoe/TicTacToeServer';
import { GameOverSceneData } from 'models/Scenes';

export default class Bootstrap extends Phaser.Scene {
  private server!: Server;
  constructor() {
    super('bootstrap');
  }

  init() {
    this.server = new Server();
  }

  create() {
    this.createNewGame();
  }

  private createNewGame = () => {
    // 在開始遊戲時，決定遊玩順序，由房主決定
    if (this.server.playerInfo.isMaster) {
      this.server.createPlayerOrder();
    }
    this.scene.launch('game', {
      server: this.server,
      onGameOver: this.handleGameOver,
    });
  };

  private handleGameOver = (data: GameOverSceneData) => {
    this.scene.stop('game');
    // this.server.finishGame();
    this.scene.launch('game-over', {
      ...data,
      onFinish: this.handleFinish,
    });
  };

  private handleFinish = () => {
    this.scene.stop('game-over');
    // this.server.finishGame();
  };
}
