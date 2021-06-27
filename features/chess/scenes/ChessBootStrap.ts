import Phaser from 'phaser';
import Server from 'features/chess/ChessServer';
import { GameOverSceneData } from 'models/Scenes';

export default class ChessBootstrap extends Phaser.Scene {
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
    // FIXME: 重複玩幾次這個方法會不斷累積觸發
    this.scene.stop('game');
    console.log('launch game over');
    this.scene.launch('game-over', {
      ...data,
      onRestart: this.handleRestart,
      onClose: this.handleClose,
    });
  };

  private handleRestart = () => {
    // FIXME: 重複玩幾次這個方法會不斷累積觸發
    console.log('restart');
    this.scene.stop('game-over');
    this.createNewGame();
  };

  private handleClose = () => {
    // FIXME: 重複玩幾次這個方法會不斷累積觸發
    console.log('close');
    this.scene.stop('game-over');
    // this.server.resetGame();
    // this.server.closeGame();
  };

  private createNewGame = () => {
    // FIXME: 重複玩幾次這個方法會不斷累積觸發
    console.log('ceatre game');
    this.scene.launch('game', {
      server: this.server,
      onGameOver: this.handleGameOver,
    });
  };
}
