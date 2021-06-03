import Phaser from 'phaser';
import { store } from 'pages/_app';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';

export default class Bootstrap extends Phaser.Scene {
  private room?: ClientRoom<Room>;
  constructor() {
    super('bootstrap');
    const { server } = store.getState();
    this.room = server.room;
  }

  create() {
    this.createNewGame();
  }

  private handleGameOver = (data: any) => {
    this.scene.stop('game');
    this.scene.launch('game-over', {
      ...data,
      onRestart: this.handleRestart,
    });
  };

  private handleRestart = () => {
    this.scene.stop('game-over');
    this.createNewGame();
  };

  private createNewGame() {
    this.scene.launch('game', {
      room: this.room,
      onGameOver: this.handleGameOver,
    });
  }
}
