import { GameOverSceneData } from 'models/Scenes';
import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  create(data: GameOverSceneData) {
    const text = data.winner ? '你贏了' : '你輸了';
    const { width, height } = this.scale;
    const title = this.add
      .text(width * 0.5, height * 0.5, text, {
        fontSize: '48px',
      })
      .setOrigin(0.5);
    this.add.text(title.x, title.y + 100, '輸入 ESC 關閉視窗').setOrigin(0.5);
    this.input.keyboard.once('keyup-ESC', () => {
      if (data.onFinish) {
        data.onFinish();
      }
    });
  }
}
