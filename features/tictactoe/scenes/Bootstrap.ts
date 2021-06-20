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

  private handleGameOver = (data: GameOverSceneData) => {
    this.scene.stop('game');
    this.scene.launch('game-over', {
      ...data,
      onFinish: this.handleFinish,
    });
  };

  private handleFinish = () => {
    this.scene.stop('game-over');
    this.server.finishGame();
  };

  private createNewGame = () => {
    console.log('createNewGame');
    this.scene.launch('game', {
      server: this.server,
      onGameOver: this.handleGameOver,
    });
  };
}
